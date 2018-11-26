import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Collapse,
    Divider,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    Menu,
    MenuItem,
    Paper,
    Select,
    SvgIcon,
    Switch,
    TextField,
    Toolbar,
    Typography
} from '@material-ui/core'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import React from 'react'
import { connect } from 'react-redux'
import { arrayMove, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'
import {
    INewPeerReviewQuestion,
    INewPeerReviewQuestionTranslation,
    INewQuizItem,
    INewQuizItemTranslation,
    INewQuizOption,
    INewQuizOptionTranslation,
    INewQuizQuery,
    INewQuizTranslation
} from '../../../common/src/types/index'
import { addItem, addOption, changeAttr, changeOrder, newQuiz, save, setEdit } from '../store/edit/actions'
import { setFilter } from '../store/filter/actions'

class QuizForm extends React.Component<any, any> {

    private itemTypes = [
        "checkbox",
        "essay",
        "open",
        "radio",
        "research-agreement",
        "scale"
    ]

    constructor(props) {
        super(props)
        this.state = {
            menuOpen: null
        }
    }

    public componentDidMount() {
        if (this.props.quiz) {
            this.props.setEdit(this.props.quiz)
        } else {
            this.props.newQuiz()
        }
    }

    public render() {
        return (
            <form onSubmit={this.submitQuiz}>
                <FormControl>
                    <InputLabel>Course</InputLabel>
                    <Select onChange={this.selectCourse} value={this.props.edit.course.id || this.props.filter.course} inputProps={{ name: 'course' }} style={{ minWidth: 350 }}>
                        {this.props.courses.map(course => <MenuItem key={course.id} value={course.id}>{course.texts[0].title}</MenuItem>) || ""}
                    </Select>
                </FormControl>
                {this.props.edit.course.languages ?
                    <div>
                        <Tabs value={this.props.filter.language} onChange={this.handleTabs} style={{ marginTop: 50 }}>
                            {this.props.edit.course.languages.map(l => <Tab value={l.id} key={l.id} label={l.id} />) || ""}
                            <Tab label="add" onClick={this.addLanguage} />
                        </Tabs>
                        {this.props.edit.course.languages.map((l, i) => (
                            this.props.filter.language === l.id && <TabContainer
                                quiz={this.props.edit}
                                handleChange={this.handleChange}
                                key={l.name}
                                language={l.id}
                                onSortEnd={this.onSortEnd}
                                addItem={this.props.addItem}
                                addOption={this.addOption}
                            />))}
                    </div> :
                    <p />
                }
                <Button id="menu" onClick={this.handleMenu}>Add item</Button>
                <Menu anchorEl={this.state.menuOpen} open={Boolean(this.state.menuOpen)} onClose={this.handleMenu}>
                    {this.itemTypes.map(type => <MenuItem key={type} value={type} onClick={this.addItem}>{type}</MenuItem>)}
                </Menu>
                <Toolbar>
                    <Typography style={{ flex: 1 }} />
                    <Button onClick={this.props.save}>save</Button>
                </Toolbar>
            </form>
        )
    }

    private addOption = item => event => {
        this.props.addOption(item)
    }

    private addItem = event => {
        this.setState({
            menuOpen: null
        })
        this.props.addItem(event.target.value)
    }

    private handleMenu = (event) => {
        this.setState({
            menuOpen: this.state.menuOpen ? null : event.currentTarget
        })
    }

    private onSortEnd = ({ oldIndex, newIndex, collection }) => {
        this.props.changeOrder(collection, oldIndex, newIndex)
    }

    private handleChange = path => event => {
        console.log(typeof event.target.value)
        this.props.changeAttr(path, path.endsWith('correct') ? event.target.checked : event.target.value)
    }

    private addLanguage = () => {
        console.log("do you want to add language to course blaablaa")
    }

    private handleTabs = (event, value) => {
        this.props.setFilter('language', value)
    }

    private selectCourse = (event) => {
        console.log(event.target.value)
    }

    private submitQuiz = (event) => {
        event.preventDefault()
        console.log(event.target.title_fi_FI.value)
        console.log(event.target.title_en_US.value)
    }
}

const TabContainer = (props: any) => {
    const index = props.quiz.texts.findIndex(t => t.languageId === props.language)
    return (
        <div>
            <div style={{ marginTop: 50 }}>
                <TextField
                    onChange={props.handleChange(`texts[${index}].title`)}
                    label='Title'
                    value={props.quiz.texts[index].title}
                    margin="normal"
                    fullWidth={true}
                    multiline={true}
                />
                <TextField
                    onChange={props.handleChange(`texts[${index}].body`)}
                    label='Body'
                    value={props.quiz.texts[index].body}
                    margin="normal"
                    fullWidth={true}
                    multiline={true}
                    rowsMax="10"
                />
            </div>
            <div style={{ marginTop: 50 }}>
                <Typography variant='subtitle1'>Items:</Typography>
                <ItemContainer
                    onSortEnd={props.onSortEnd}
                    hidden={props.hidden}
                    quiz={props.quiz}
                    language={props.language}
                    handleChange={props.handleChange}
                    handleSort={props.onSortEnd}
                    addItem={props.addItem}
                    addOption={props.addOption}
                    useDragHandle={true}
                />
            </div>
        </div>
    )
}

const ItemContainer = SortableContainer((props: any) => {
    return (
        <div>
            {props.quiz.items.sort((i1, i2) => i1.order - i2.order).map((item, i) =>
                <SortableWrapper key={item.id || item.type + i} index={i} collection="items">
                    <Item
                        item={item}
                        language={props.language}
                        handleChange={props.handleChange}
                        index={i}
                        handleSort={props.handleSort}
                        addOption={props.addOption}
                        collection="items"
                    />
                </SortableWrapper>)}
        </div>
    )
})

const OptionContainer = SortableContainer((props: any) => {
    return (
        <Grid container={true} spacing={16}>
            {props.options.sort((o1, o2) => o1.order - o2.order).map((option, index) =>
                <Option handleChange={props.handleChange} option={option} language={props.language} key={option.id || props.itemOrder + index} index={index} collection={`items[${props.itemOrder}].options`} itemOrder={props.itemOrder}/>
            )}
            <Grid item={true} xs={3} >
                <Paper style={{ padding: 5, marginBottom: 5 }}>
                    <Button onClick={props.addOption(props.itemOrder)} fullWidth={true}>add</Button>
                </Paper>
            </Grid>
        </Grid>
    )
})

const SortableGridItem = SortableElement((props: any) => <Grid item={true} xs={props.size}>{props.children}</Grid>)


class Option extends React.Component<any, any> {

    constructor(props) {
        super(props)
        this.state = {
            expanded: false
        }
    }

    public render() {
        return (
            <SortableGridItem index={this.props.index} collection={this.props.collection} size={!this.state.expanded ? 3 : 12}>
                <Card style={{ marginBottom: 20 }}>
                    <DragHandleWrapper>
                        <CardHeader
                            title={this.props.option.texts.find(t => t.languageId === this.props.language).title}
                            titleTypographyProps={{ variant: "subtitle1", gutterBottom: false }}
                        />
                        <Switch checked={this.props.option.correct} value={!this.props.option.correct} color="primary" onChange={this.props.handleChange(`items[${this.props.itemOrder}].options[${this.props.index}].correct`)} />
                    </DragHandleWrapper>
                    <CardActions>
                        <IconButton onClick={this.handleExpand}>
                            <SvgIcon><path d="M12.44 6.44L9 9.88 5.56 6.44 4.5 7.5 9 12l4.5-4.5z" /></SvgIcon>
                        </IconButton>
                    </CardActions>
                    <Collapse in={this.state.expanded}>
                        <CardContent>
                            <Card>
                                <CardHeader subheader="general" />
                                <CardContent>
                                    <TextField
                                        label="title"
                                        value={this.props.option.texts.find(t => t.languageId === this.props.language).title || undefined}
                                        fullWidth={true}
                                        onChange={this.props.handleChange(`items[${this.props.itemOrder}].options[${this.props.index}].texts[${this.props.option.texts.findIndex(t => t.languageId === this.props.language)}].title`)}
                                        multiline={true}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="body"
                                        value={this.props.option.texts.find(t => t.languageId === this.props.language).body || undefined}
                                        fullWidth={true}
                                        onChange={this.props.handleChange(`items[${this.props.itemOrder}].options[${this.props.index}].texts[${this.props.option.texts.findIndex(t => t.languageId === this.props.language)}].body`)}
                                        multiline={true}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="success message"
                                        value={this.props.option.texts.find(t => t.languageId === this.props.language).successMessage || undefined}
                                        fullWidth={true}
                                        onChange={this.props.handleChange(`items[${this.props.itemOrder}].options[${this.props.index}].texts[${this.props.option.texts.findIndex(t => t.languageId === this.props.language)}].successMessage`)}
                                        multiline={true}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="failure message"
                                        value={this.props.option.texts.find(o => o.languageId === this.props.language).failureMessage || undefined}
                                        fullWidth={true}
                                        onChange={this.props.handleChange(`items[${this.props.itemOrder}].options[${this.props.index}].texts[${this.props.option.texts.findIndex(t => t.languageId === this.props.language)}].failureMessage`)}
                                        multiline={true}
                                        margin="normal"
                                    />
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Collapse>
                </Card>
            </SortableGridItem>
        )
    }

    private handleExpand = (event) => {
        this.setState({ expanded: !this.state.expanded })
    }
}

class Item extends React.Component<any, any> {

    constructor(props) {
        super(props)
        this.state = {
            expanded: false
        }
    }

    public render() {
        return (
            <Card style={{ marginBottom: 20 }}>
                <DragHandleWrapper>
                    <CardHeader
                        title={this.props.item.texts.find(t => t.languageId === this.props.language).title}
                        titleTypographyProps={{ variant: "subtitle1", gutterBottom: false }}
                    />
                </DragHandleWrapper>
                <CardActions>
                    <IconButton onClick={this.handleExpand}>
                        <SvgIcon><path d="M12.44 6.44L9 9.88 5.56 6.44 4.5 7.5 9 12l4.5-4.5z" /></SvgIcon>
                    </IconButton>
                </CardActions>
                <Collapse in={this.state.expanded}>
                    <CardContent>
                        <Grid style={{ flexGrow: 1 }} container={true} spacing={16}>
                            <Grid item={true} xs={12}>
                                <Card>
                                    <CardHeader subheader="general" />
                                    <CardContent>
                                        <TextField
                                            label="title"
                                            value={this.props.item.texts.find(t => t.languageId === this.props.language).title || undefined}
                                            fullWidth={true}
                                            onChange={this.props.handleChange(`items[${this.props.item.order}].texts[${this.props.item.texts.findIndex(t => t.languageId === this.props.language)}].title`)}
                                            multiline={true}
                                            margin="normal"
                                        />
                                        <TextField
                                            label="body"
                                            value={this.props.item.texts.find(t => t.languageId === this.props.language).body || undefined}
                                            fullWidth={true}
                                            onChange={this.props.handleChange(`items[${this.props.item.order}].texts[${this.props.item.texts.findIndex(t => t.languageId === this.props.language)}].body`)}
                                            multiline={true}
                                            margin="normal"
                                        />
                                        <TextField
                                            label="success message"
                                            value={this.props.item.texts.find(t => t.languageId === this.props.language).successMessage || undefined}
                                            fullWidth={true}
                                            onChange={this.props.handleChange(`items[${this.props.item.order}].texts[${this.props.item.texts.findIndex(t => t.languageId === this.props.language)}].successMessage`)}
                                            multiline={true}
                                            margin="normal"
                                        />
                                        <TextField
                                            label="failure message"
                                            value={this.props.item.texts.find(t => t.languageId === this.props.language).failureMessage || undefined}
                                            fullWidth={true}
                                            onChange={this.props.handleChange(`items[${this.props.item.order}].texts[${this.props.item.texts.findIndex(t => t.languageId === this.props.language)}].failureMessage`)}
                                            multiline={true}
                                            margin="normal"
                                        />
                                        <TextField
                                            label="validity regex"
                                            fullWidth={true}
                                            value={this.props.item.validityRegex || undefined}
                                            margin="normal"
                                        />
                                        <TextField
                                            label="format regex"
                                            fullWidth={true}
                                            value={this.props.item.formatRegex || undefined}
                                            margin="normal"
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item={true} xs={12}>
                                <Card>
                                    <CardHeader subheader="options" />
                                    <CardContent>
                                        <OptionContainer
                                            axis="xy"
                                            onSortEnd={this.props.handleSort}
                                            options={this.props.item.options}
                                            itemOrder={this.props.item.order}
                                            useDragHandle={true}
                                            addOption={this.props.addOption}
                                            language={this.props.language}
                                            handleChange={this.props.handleChange}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Collapse>
            </Card>
        )
    }

    private handleExpand = (event) => {
        this.setState({ expanded: !this.state.expanded })
    }
}

/*<SortableWrapper key={option.id || props.itemOrder + index} index={index} collection={`items[${props.itemOrder}].options`}>
    <Option option={option} language={props.language} key={option.id || props.itemOrder + index} index={index} collection={`items[${props.itemOrder}].options`} />
</SortableWrapper>*/



const OptionContainerOld = SortableContainer((props: any) => {
    return (
        <Grid container={true} spacing={16}>
            {props.options.sort((o1, o2) => o1.order - o2.order).map((option, index) => <Option collection={`items[${props.itemOrder}].options`} option={option} index={index} key={option.id || props.itemOrder + index} />)}
            <Grid item={true} xs={3} >
                <Paper style={{ padding: 5, marginBottom: 5 }}>
                    <Button onClick={props.addOption(props.itemOrder)} fullWidth={true}>add</Button>
                </Paper>
            </Grid>
        </Grid>
    )
})

const OptionOld = SortableElement((props: any) => {
    return (
        <Grid item={true} xs={3} >
            <Paper style={{ padding: 5, marginBottom: 5 }}>
                <TextField value={props.option.texts[0].title} multiline={true} />
                <Switch checked={props.option.correct} color="primary" />
            </Paper>
        </Grid>
    )
})

const DragHandle = SortableHandle(() => <SvgIcon><path d="M20 9H4v2h16V9zM4 15h16v-2H4v2z" /></SvgIcon>)

const DragHandleWrapper = SortableHandle((props: any) => <div>{props.children}</div>)

const SortableWrapper = SortableElement((props: any) => <div>{props.children}</div>)


/* const ItemSwitch = ({item, language, handleChange, index, handleSort }: any) => {
    // console.log(item.type)
    switch (item.type) {
        case "open":
                            return (
                <OpenItem
                    collection="items"
                    item={item}
                    language={language}
                    handleChange={handleChange}
                    index={index}
                />
                )
            case "essay":
                break
            case "radio":
                return (
                <RadioItem
                    handleSort={handleSort}
                    collection="items"
                    item={item}
                    language={language}
                    handleChange={handleChange}
                    index={index}
                />
                )
            case "checkbox":
                return (
                <RadioItem
                    handleSort={handleSort}
                    collection="items"
                    item={item}
                    language={language}
                    handleChange={handleChange}
                    index={index}
                />
                )
            case "scale":
                break
            case "research-agreement":
                break
        }
    return <p />
                }

const OpenItem = SortableElement((props: any) => {
    return (
        <ExpansionPanel style={{ marginBottom: 20 }}>
                    <ExpansionPanelSummary>
                        <div style={{ flexBasis: "5%" }} >
                            <DragHandle />
                        </div>
                        <div style={{ flexBasis: "70%" }}>
                            <TextField
                                label="title"
                                value={props.item.texts.find(t => t.languageId === props.language).title}
                                fullWidth={true}
                                onChange={props.handleChange(`items[${props.item.order}].texts[${props.item.texts.findIndex(t => t.languageId === props.language)}].title`)}
                                multiline={true}
                            />
                        </div>
                        <div style={{ flexBasis: "20%" }} />
                        <div style={{ flexBasis: "5%" }}>
                            <p>{props.item.order}</p>
                        </div>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <TextField
                            label="validity regex"
                            fullWidth={true}
                            value={props.item.validityRegex}
                        />
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                )
            })

const RadioItem = SortableElement((props: any) => {
    return (
        <ExpansionPanel style={{ marginBottom: 20 }}>
                    <ExpansionPanelSummary>
                        <div style={{ flexBasis: "5%" }} >
                            <DragHandle />
                        </div>
                        <div style={{ flexBasis: "70%" }}>
                            <TextField
                                label="title"
                                value={props.item.texts.find(t => t.languageId === props.language).title}
                                fullWidth={true}
                                onChange={props.handleChange(`items[${props.item.order}].texts[${props.item.texts.findIndex(t => t.languageId === props.language)}].title`)}
                                multiline={true}
                            />
                        </div>
                        <div style={{ flexBasis: "20%" }} />
                        <div style={{ flexBasis: "5%" }}>
                            <p>{props.item.order}</p>
                        </div>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <OptionContainer onSortEnd={props.handleSort} options={props.item.options} itemOrder={props.item.order} useDragHandle={true} />
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                )
            }) */


const mapStateToProps = (state: any) => {
    return {
        courses: state.courses,
        edit: state.edit,
        filter: state.filter,
        quizzes: state.quizzes,
        user: state.user
    }
}

const mapDispatchToProps = {
    addItem,
    addOption,
    changeAttr,
    changeOrder,
    newQuiz,
    save,
    setEdit,
    setFilter
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizForm)