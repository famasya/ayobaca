export type Book = {
  id: string
  name: string
  description: string
  thumborCoverImageUrl: string
  coverImageUrl: string
  coverImageServingUrl: string
  languageId: string
  language: {
    createdDate: number
    lastUpdated: number
    id: number
    name: string
    country: string
    languageISOCode: string
    direction: string
    uiLanguage: boolean
    signLanguage: boolean
    deleted: boolean
  }
  signLanguageId: any
  signLanguage: any
  masterBookId: string
  nonMasterMetaDatas: Array<{
    id: string
    name: string
    languageId: string
    masterBookId: string
  }>
  masterBookMetaData: {
    title: string
    readingLevel: string
    description: string
    publisher: any
    authors: Array<any>
    illustrator: string
    collaboratorsByRole: {
      AMBASSADOR: Array<any>
      NARRATOR: Array<any>
      EDITOR: Array<{
        createdDate: number
        lastUpdated: number
        id: number
        name: string
        localizedName: string
        photoUrl: string
        country: string
        bio: string
        roles: Array<string>
        deleted: boolean
      }>
      ILLUSTRATOR: Array<{
        createdDate: number
        lastUpdated: number
        id: number
        name: string
        localizedName: string
        photoUrl: string
        country: string
        bio: string
        roles: Array<string>
        deleted: boolean
      }>
      AUTHOR: Array<{
        createdDate: number
        lastUpdated: number
        id: number
        name: string
        localizedName: string
        photoUrl: string
        country: string
        bio: string
        roles: Array<string>
        deleted: boolean
      }>
      PUBLISHER: Array<{
        createdDate: number
        lastUpdated: number
        id: number
        name: string
        localizedName: string
        photoUrl: string
        country: string
        bio: string
        roles: Array<string>
        deleted: boolean
      }>
      CONTRIBUTOR: Array<{
        createdDate: number
        lastUpdated: number
        id: number
        name: string
        localizedName: string
        photoUrl: string
        country: string
        bio: string
        roles: Array<string>
        deleted: boolean
      }>
      ORGANIZATION: Array<any>
      DESIGNER: Array<any>
      SIGNER: Array<any>
    }
    license: string
    originalUrl: string
    languageName: string
  }
  illustrator: string
  createdDate: number
  featuredTimeStamp: number
  status: string
  availableLanguages: Array<{
    createdDate: number
    lastUpdated: number
    id: number
    name: string
    country: string
    languageISOCode: string
    direction: string
    uiLanguage: boolean
    signLanguage: boolean
    deleted: boolean
  }>
  availableAudioLanguages: Array<any>
  availableVideoLanguages: Array<any>
  featuredLanguages: Array<any>
  authors: Array<any>
  contributingUsers: Array<any>
  collaboratorsByRole: {
    AMBASSADOR: Array<any>
    NARRATOR: Array<any>
    EDITOR: Array<{
      createdDate: number
      lastUpdated: number
      id: number
      name: string
      localizedName: string
      photoUrl: string
      country: string
      bio: string
      roles: Array<string>
      deleted: boolean
    }>
    ILLUSTRATOR: Array<{
      createdDate: number
      lastUpdated: number
      id: number
      name: string
      localizedName: string
      photoUrl: string
      country: string
      bio: string
      roles: Array<string>
      deleted: boolean
    }>
    AUTHOR: Array<{
      createdDate: number
      lastUpdated: number
      id: number
      name: string
      localizedName: string
      photoUrl: string
      country: string
      bio: string
      roles: Array<string>
      deleted: boolean
    }>
    PUBLISHER: Array<{
      createdDate: number
      lastUpdated: number
      id: number
      name: string
      localizedName: string
      photoUrl: string
      country: string
      bio: string
      roles: Array<string>
      deleted: boolean
    }>
    CONTRIBUTOR: Array<{
      createdDate: number
      lastUpdated: number
      id: number
      name: string
      localizedName: string
      photoUrl: string
      country: string
      bio: string
      roles: Array<string>
      deleted: boolean
    }>
    ORGANIZATION: Array<any>
    DESIGNER: Array<any>
    SIGNER: Array<any>
  }
  readingLevel: string
  totalPages: number
  license: string
  publisher: any
  notes: any
  progress: number
  currentPage: number
  slug: string
  activity: any
  hasActivity: boolean
  hasAudio: boolean
  hasVideo: boolean
  epubUrl: string
  pdfUrl: {
    bookId: string
    bookletUrl: string
    landscapeUrl: string
    potraitUrl: string
  }
  pages: Array<{
    id: number
    extractedLongContentValue: string
    bookId: string
    pageNum: number
    imageUrl: string
    imageServingUrl: string
    thumborImageUrl: string
    thumborImageUrlWithourResizing: string
    imageWidth: number
    imageHeight: number
    imageType: any
    imageName: string
    imageAltDescription: any
    useHighResolutionImage: boolean
    alttext: string
    audio: any
    video: any
    translatedState: boolean
    idClone: string
    deleted: boolean
  }>
  originalUrl: string
  tags: Array<{
    createdDate: number
    lastUpdated: number
    id: number
    name: string
    url: string
    localizations: Record<string, string>
    idClone: string
    deleted: boolean
  }>
  translationAvailable: boolean
  translationStatus: any
  countryOfOrigin: string
  favorite: boolean
  featured: boolean
}

export type BookSearchResult = {
  _name: string
  _authors: string
  _coverimage: string
  _language: string
  _languageid: string
  _masterbookid: string
  _readinglevel: number
  _totalpages: number
  _tags: Array<{
    id: number
    name: string
  }>
  _availablelanguages: Array<{
    id: number
    name: string
  }>
  _seqid: number
  _description: string
  _randomfactor: number
}

export type BookContent = {
  masterBookId: string
  name: string
  authors: string
  coverImage: string
  book_details: {
    pageNum: number
    bookId: string
    content: string
    contentRaw: string
  }[]
}
