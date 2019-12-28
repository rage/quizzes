export interface Course {
  id: string
  minScoreToPass: null
  minProgressToPass: null
  minPeerReviewsReceived: number | null
  minPeerReviewsGiven: number | null
  minReviewAverage: null | string
  maxSpamFlags: number | null
  moocfiId: null | string
  createdAt: Date
  updatedAt: Date
  texts: Text[]
  organization: null
  languages: Language[]
}

export interface Language {
  id: ID
  country: Country
  name: Name
  createdAt: Date
  updatedAt: Date
}

export enum Country {
  Finland = "Finland",
  Sweden = "Sweden",
  UnitedStates = "United States",
  Unknown = "Unknown",
}

export enum ID {
  EnUS = "en_US",
  FiFI = "fi_FI",
  SvSE = "sv_SE",
  Unknown = "unknown",
}

export enum Name {
  English = "English",
  Finnish = "Finnish",
  Swedish = "Swedish",
  Unknown = "Unknown",
}

export interface Text {
  courseId: string
  languageId: ID
  abbreviation: string
  title: string
  body: string
  createdAt: Date
  updatedAt: Date
}
