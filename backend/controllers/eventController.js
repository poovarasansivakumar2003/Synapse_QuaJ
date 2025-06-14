import Event from '../models/Event.model.js'
import debugLib from 'debug'

const debug = debugLib('app:eventController')

const eventController = {
  createEvent: async (req, res) => {
    try {
      debug(`Creating event by user: ${req.user.id}`)
      const event = await Event.create({
        ...req.body,
        organizer: req.user.id,
        university: req.user.university,
      })
      debug(`Event created: ${event._id}`)
      res.status(201).json(event)
    } catch (err) {
      debug(`Error creating event: ${err.message}`)
      res.status(500).json({ error: 'Internal server error' })
    }
  },
  getEvents: async (req, res) => {
    try {
      debug(`Fetching events for university: ${req.user.university}`)
      const events = await Event.find({
        university: req.user.university,
        $or: [
          { targetBatches: req.user.batch },
          { targetBranches: { $exists: false } },
        ],
      })
      res.json(events)
    } catch (err) {
      debug(`Error fetching events: ${err.message}`)
      res.status(500).json({ error: 'Internal server error' })
    }
  },
  rsvpEvent: async (req, res) => {
    try {
      debug(`RSVP for event: ${req.params.eventId} by user: ${req.user.id}`)
      const event = await Event.findById(req.params.eventId)
      const existingIndex = event.rsvp.findIndex(
        (r) => r.user.toString() === req.user.id
      )
      if (existingIndex >= 0) {
        event.rsvp[existingIndex].status = req.body.status
        debug(`Updated RSVP status for user: ${req.user.id}`)
      } else {
        event.rsvp.push({
          user: req.user.id,
          status: req.body.status || 'going',
        })
      }
      await event.save()
      res.json(event)
    } catch (err) {
      debug(`Error RSVPing to event: ${err.message}`)
      res.status(500).json({ error: 'Internal server error' })
    }
  },
}

export default eventController
