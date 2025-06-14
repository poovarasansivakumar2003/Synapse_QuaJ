import Job from '../models/Job.model.js'
import debugLib from 'debug'

const debug = debugLib('app:jobController')

const jobController = {
  getJobs: async (req, res) => {
    try {
      debug(`Fetching jobs for user: ${req.user.id}`)
      const jobs = await Job.find({
        university: req.user.university,
        targetBranches: req.user.branch,
      })
      res.json(jobs)
    } catch (error) {
      debug(`Error fetching jobs: ${error.message}`)
      res.status(500).json({ error: 'Internal server error' })
    }
  },
  applyJob: async (req, res) => {
    try {
      debug(`Applying for job: ${req.params.jobId} by user: ${req.user.id}`)
      const job = await Job.findById(req.params.jobId)
      const existingApplication = job.applications.find(
        (app) => app.applicant.toString() === req.user.id
      )
      if (existingApplication) {
        debug(`User ${req.user.id} has already applied for this job`)
        return res
          .status(400)
          .json({ error: 'You have already applied for this job' })
      }
      job.applications.push({
        applicant: req.user.id,
        status: 'submitted',
      })
      await job.save()
      res.json(job)
    } catch (error) {
      debug(`Error applying for job: ${error.message}`)
      res.status(500).json({ error: 'Internal server error' })
    }
  },
}

export default jobController
