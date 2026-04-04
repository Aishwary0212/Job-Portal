const APPLICATIONS_KEY = 'applications'

const readApplications = () => {
  try {
    return JSON.parse(localStorage.getItem(APPLICATIONS_KEY) || '[]')
  } catch {
    return []
  }
}

export const getApplications = () => readApplications()

export const getApplicationsForUser = (userId) =>
  readApplications().filter((application) => String(application.userId) === String(userId))

export const getApplicationsForRecruiter = (recruiterId, jobs = []) => {
  const applications = readApplications()

  return applications.filter((application) => {
    if (application.recruiterId) {
      return String(application.recruiterId) === String(recruiterId)
    }

    return jobs.some((job) => String(job._id) === String(application.jobId))
  })
}

export const hasAppliedToJob = (userId, jobId) =>
  readApplications().some(
    (application) => String(application.userId) === String(userId) && String(application.jobId) === String(jobId)
  )

export const saveApplication = (application) => {
  const applications = readApplications()
  applications.push(application)
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications))
}
