import { Bug, CreateBugRequest, UpdateBugRequest } from '@/types/bug'

/**
 * Mock bug service that simulates backend API calls
 * Uses localStorage for persistence in this demo
 */
export class BugService {
  private static STORAGE_KEY = 'bug-tracker-bugs'
  
  /**
   * Get all bugs from storage
   */
  static async getBugs(): Promise<Bug[]> {
    try {
      console.log('Fetching bugs from storage...') // Debug log
      
      const stored = localStorage.getItem(this.STORAGE_KEY)
      const bugs = stored ? JSON.parse(stored) : []
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      console.log(`Found ${bugs.length} bugs`) // Debug log
      return bugs
    } catch (error) {
      console.error('Error fetching bugs:', error)
      throw new Error('Failed to fetch bugs')
    }
  }
  
  /**
   * Create a new bug
   */
  static async createBug(request: CreateBugRequest): Promise<Bug> {
    try {
      console.log('Creating new bug:', request) // Debug log
      
      const bugs = await this.getBugs()
      
      const newBug: Bug = {
        id: this.generateId(),
        ...request,
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      bugs.push(newBug)
      await this.saveBugs(bugs)
      
      console.log('Bug created successfully:', newBug.id) // Debug log
      return newBug
    } catch (error) {
      console.error('Error creating bug:', error)
      throw new Error('Failed to create bug')
    }
  }
  
  /**
   * Update an existing bug
   */
  static async updateBug(id: string, request: UpdateBugRequest): Promise<Bug> {
    try {
      console.log(`Updating bug ${id}:`, request) // Debug log
      
      const bugs = await this.getBugs()
      const bugIndex = bugs.findIndex(bug => bug.id === id)
      
      if (bugIndex === -1) {
        throw new Error('Bug not found')
      }
      
      const updatedBug: Bug = {
        ...bugs[bugIndex],
        ...request,
        updatedAt: new Date().toISOString()
      }
      
      bugs[bugIndex] = updatedBug
      await this.saveBugs(bugs)
      
      console.log('Bug updated successfully:', id) // Debug log
      return updatedBug
    } catch (error) {
      console.error('Error updating bug:', error)
      throw error
    }
  }
  
  /**
   * Delete a bug
   */
  static async deleteBug(id: string): Promise<void> {
    try {
      console.log(`Deleting bug ${id}`) // Debug log
      
      const bugs = await this.getBugs()
      const filteredBugs = bugs.filter(bug => bug.id !== id)
      
      if (filteredBugs.length === bugs.length) {
        throw new Error('Bug not found')
      }
      
      await this.saveBugs(filteredBugs)
      console.log('Bug deleted successfully:', id) // Debug log
    } catch (error) {
      console.error('Error deleting bug:', error)
      throw error
    }
  }
  
  /**
   * Get bug by ID
   */
  static async getBugById(id: string): Promise<Bug | null> {
    try {
      const bugs = await this.getBugs()
      return bugs.find(bug => bug.id === id) || null
    } catch (error) {
      console.error('Error getting bug by ID:', error)
      return null
    }
  }
  
  /**
   * Private helper methods
   */
  private static async saveBugs(bugs: Bug[]): Promise<void> {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bugs))
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))
    } catch (error) {
      console.error('Error saving bugs:', error)
      throw new Error('Failed to save bugs')
    }
  }
  
  private static generateId(): string {
    // INTENTIONAL BUG: Simple ID generation that might create duplicates
    return Date.now().toString() + Math.random().toString(36).substr(2, 5)
  }
  
  /**
   * Seed data for demonstration
   */
  static async seedData(): Promise<void> {
    const existingBugs = await this.getBugs()
    if (existingBugs.length > 0) return
    
    const seedBugs: Bug[] = [
      {
        id: 'bug-1',
        title: 'Login form validation not working',
        description: 'Users can submit empty login forms without validation errors',
        status: 'open',
        severity: 'high',
        priority: 'high',
        reportedBy: 'john.doe@example.com',
        assignedTo: 'dev@example.com',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        tags: ['authentication', 'validation', 'frontend'],
        stepsToReproduce: '1. Go to login page\n2. Leave fields empty\n3. Click submit',
        expectedBehavior: 'Validation errors should appear',
        actualBehavior: 'Form submits without validation'
      },
      {
        id: 'bug-2',
        title: 'Database connection timeout',
        description: 'API requests randomly fail with timeout errors',
        status: 'in-progress',
        severity: 'critical',
        priority: 'critical',
        reportedBy: 'jane.smith@example.com',
        assignedTo: 'backend@example.com',
        createdAt: '2024-01-14T14:30:00Z',
        updatedAt: '2024-01-15T09:15:00Z',
        tags: ['database', 'performance', 'backend']
      }
    ]
    
    await this.saveBugs(seedBugs)
    console.log('Seed data created')
  }
}