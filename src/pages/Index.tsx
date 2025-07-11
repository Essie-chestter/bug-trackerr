import { useState, useEffect } from 'react'
import { Bug, CreateBugRequest } from '@/types/bug'
import { BugService } from '@/services/bugService'
import { BugList } from '@/components/BugList'
import { BugForm } from '@/components/BugForm'
import { DebugPanel } from '@/components/DebugPanel'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { useDebugLogger } from '@/hooks/useDebugLogger'
import { Loader2 } from 'lucide-react'

const Index = () => {
  const [bugs, setBugs] = useState<Bug[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBug, setEditingBug] = useState<Bug | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { logs, errors, networkRequests, clearLogs, clearErrors, addLog } = useDebugLogger()
  
  // Load bugs on mount
  useEffect(() => {
    loadBugs()
  }, [])
  
  const loadBugs = async () => {
    try {
      setIsLoading(true)
      console.log('Loading bugs...') // Debug log
      
      // Seed data if first time
      await BugService.seedData()
      
      const loadedBugs = await BugService.getBugs()
      setBugs(loadedBugs)
      console.log('Bugs loaded successfully:', loadedBugs.length) // Debug log
    } catch (error) {
      console.error('Failed to load bugs:', error)
      toast({
        title: 'Error',
        description: 'Failed to load bugs. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleCreateBug = async (bugData: CreateBugRequest) => {
    try {
      setIsSubmitting(true)
      console.log('Creating bug:', bugData) // Debug log
      
      const newBug = await BugService.createBug(bugData)
      setBugs(prev => [newBug, ...prev])
      setIsFormOpen(false)
      
      toast({
        title: 'Success',
        description: 'Bug reported successfully!'
      })
    } catch (error) {
      console.error('Failed to create bug:', error)
      toast({
        title: 'Error',
        description: 'Failed to create bug. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleUpdateBug = async (bugData: CreateBugRequest) => {
    if (!editingBug) return
    
    try {
      setIsSubmitting(true)
      console.log('Updating bug:', editingBug.id, bugData) // Debug log
      
      const updatedBug = await BugService.updateBug(editingBug.id, bugData)
      setBugs(prev => prev.map(bug => 
        bug.id === editingBug.id ? updatedBug : bug
      ))
      setEditingBug(null)
      setIsFormOpen(false)
      
      toast({
        title: 'Success',
        description: 'Bug updated successfully!'
      })
    } catch (error) {
      console.error('Failed to update bug:', error)
      toast({
        title: 'Error',
        description: 'Failed to update bug. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleDeleteBug = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bug?')) return
    
    try {
      console.log('Deleting bug:', id) // Debug log
      await BugService.deleteBug(id)
      setBugs(prev => prev.filter(bug => bug.id !== id))
      
      toast({
        title: 'Success',
        description: 'Bug deleted successfully!'
      })
    } catch (error) {
      console.error('Failed to delete bug:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete bug. Please try again.',
        variant: 'destructive'
      })
    }
  }
  
  const handleStatusChange = async (id: string, status: Bug['status']) => {
    try {
      console.log('Changing bug status:', id, status) // Debug log
      const updatedBug = await BugService.updateBug(id, { status })
      setBugs(prev => prev.map(bug => 
        bug.id === id ? updatedBug : bug
      ))
      
      toast({
        title: 'Success',
        description: `Bug status changed to ${status.replace('-', ' ')}`
      })
    } catch (error) {
      console.error('Failed to update bug status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update bug status. Please try again.',
        variant: 'destructive'
      })
    }
  }
  
  const handleEditBug = (bug: Bug) => {
    setEditingBug(bug)
    setIsFormOpen(true)
  }
  
  const handleCreateNew = () => {
    setEditingBug(null)
    setIsFormOpen(true)
  }
  
  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingBug(null)
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Bug Tracker...</p>
        </div>
      </div>
    )
  }
  
  return (
    <ErrorBoundary onError={(error) => addLog(`React Error: ${error.message}`, 'error')}>
      <div className="min-h-screen bg-gradient-bg">
        <div className="container mx-auto px-4 py-8">
          <BugList
            bugs={bugs}
            onCreateNew={handleCreateNew}
            onEdit={handleEditBug}
            onDelete={handleDeleteBug}
            onStatusChange={handleStatusChange}
            isLoading={isLoading}
          />
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingBug ? 'Edit Bug Report' : 'Create New Bug Report'}
                </DialogTitle>
              </DialogHeader>
              <BugForm
                onSubmit={editingBug ? handleUpdateBug : handleCreateBug}
                onCancel={handleCloseForm}
                initialData={editingBug || undefined}
                isLoading={isSubmitting}
              />
            </DialogContent>
          </Dialog>
          
          {/* Debug Panel for Testing & Debugging */}
          <DebugPanel
            bugs={bugs}
            logs={logs}
            errors={errors}
            networkRequests={networkRequests}
            onClearLogs={clearLogs}
            onClearErrors={clearErrors}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
};

export default Index;
