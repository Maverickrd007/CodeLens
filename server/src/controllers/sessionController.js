import { Session } from '../models/Session.js';

export async function createSession(req, res) {
  try {
    const { title } = req.body;
    const session = new Session({
      userId: req.user.id,
      title: title || 'New Chat',
      messages: [],
    });
    await session.save();
    res.status(201).json({ session });
  } catch (error) {
    console.error('createSession error:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
}

export async function getSessions(req, res) {
  try {
    const sessions = await Session.find({ userId: req.user.id })
      .select('-messages')
      .sort({ updatedAt: -1 });
    res.status(200).json({ sessions });
  } catch (error) {
    console.error('getSessions error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
}

export async function getSession(req, res) {
  try {
    const session = await Session.findOne({ _id: req.params.id, userId: req.user.id });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.status(200).json({ session });
  } catch (error) {
    console.error('getSession error:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
}

export async function updateSession(req, res) {
  try {
    const { title } = req.body;
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title },
      { new: true }
    );
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.status(200).json({ session });
  } catch (error) {
    console.error('updateSession error:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
}

export async function deleteSession(req, res) {
  try {
    const session = await Session.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.status(200).json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('deleteSession error:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
}

export async function addMessage(req, res) {
  try {
    const { message } = req.body;
    const session = await Session.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    session.messages.push(message);
    await session.save();
    
    res.status(200).json({ session });
  } catch (error) {
    console.error('addMessage error:', error);
    res.status(500).json({ error: 'Failed to add message' });
  }
}
