import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { queryClient } from '@/lib/queryClient'
import { ActiveSessionProvider } from '@/contexts/ActiveSessionContext'
import { Navbar } from '@/components/Navbar'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { ProjectPage } from '@/pages/ProjectPage'
import { DashboardPage } from '@/pages/DashboardPage'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ActiveSessionProvider>
        <BrowserRouter>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </main>
          <Toaster richColors position="bottom-right" />
        </BrowserRouter>
      </ActiveSessionProvider>
    </QueryClientProvider>
  )
}
