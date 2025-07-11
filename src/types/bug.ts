export type BugStatus = 'open' | 'in-progress' | 'resolved'
export type BugSeverity = 'low' | 'medium' | 'high' | 'critical'
export type BugPriority = 'low' | 'medium' | 'high' | 'critical'

export interface Bug {
  id: string
  title: string
  description: string
  status: BugStatus
  severity: BugSeverity
  priority: BugPriority
  assignedTo?: string
  reportedBy: string
  createdAt: string
  updatedAt: string
  tags: string[]
  stepsToReproduce?: string
  expectedBehavior?: string
  actualBehavior?: string
}

export interface CreateBugRequest {
  title: string
  description: string
  severity: BugSeverity
  priority: BugPriority
  assignedTo?: string
  reportedBy: string
  tags: string[]
  stepsToReproduce?: string
  expectedBehavior?: string
  actualBehavior?: string
}

export interface UpdateBugRequest {
  title?: string
  description?: string
  status?: BugStatus
  severity?: BugSeverity
  priority?: BugPriority
  assignedTo?: string
  tags?: string[]
  stepsToReproduce?: string
  expectedBehavior?: string
  actualBehavior?: string
}