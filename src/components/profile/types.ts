export interface ProfileData {
  headline: string
  location: string
  linkedinUrl: string
  githubUrl: string
  portfolioUrl: string
}

export interface Resume {
  id: string
  originalName: string
  label: string | null
  contentType: string
  isDefault: boolean
  thumbnailKey: string | null
  thumbnailUrl: string | null  // returned by listResumes eagerly
  createdAt: string
  downloadUrl: string | null   // fetched lazily on download click
}

export const ALLOWED_RESUME_TYPES: Record<string, boolean> = {
  'application/pdf': true,
  'application/msword': true,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true,
}

export const MAX_RESUME_SIZE_MB = 10
export const MAX_RESUME_SIZE = MAX_RESUME_SIZE_MB * 1024 * 1024
