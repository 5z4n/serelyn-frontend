// ~50 premade supportive responses — randomized, no backend
const PREMADE_RESPONSES = [
  { emotion: "neutral", response: "I'm here with you. Take your time — there's no rush. What feels most present for you right now?" },
  { emotion: "neutral", response: "Thank you for sharing. It takes courage to open up. How has your day been so far?" },
  { emotion: "sad", response: "I hear you, and I'm really sorry you're going through this. You don't have to carry it alone. Would it help to talk more about what's weighing on you?" },
  { emotion: "sad", response: "That sounds really hard. Sadness often means something matters deeply to you. I'm here to listen whenever you're ready." },
  { emotion: "sad", response: "It's okay to not be okay. You're allowed to feel this way. What would feel supportive right now — talking it through or just being heard?" },
  { emotion: "anxious", response: "It makes sense that you're feeling this way. Let's slow down together. Try one slow breath in and out. What feels most heavy right now?" },
  { emotion: "anxious", response: "Anxiety can make everything feel bigger. You're safe in this moment. What's one small thing that usually helps you feel a bit calmer?" },
  { emotion: "anxious", response: "I get it — that worried feeling is real. You're not alone in this. What would help most right now: naming what you're afraid of, or focusing on the next small step?" },
  { emotion: "stressed", response: "Stress can be overwhelming. It's okay to pause. What's one thing you could put down or postpone, even for a few minutes?" },
  { emotion: "stressed", response: "You're carrying a lot. Remember: you don't have to solve everything today. What's the one thing that would make the next hour a little easier?" },
  { emotion: "stressed", response: "That sounds exhausting. Rest is valid. Can you give yourself permission to take a short break, even just to breathe?" },
  { emotion: "angry", response: "Your feelings are valid. Anger often protects something important. What do you think is underneath it — hurt, fear, or something else?" },
  { emotion: "angry", response: "That sounds really frustrating. It's okay to be upset. When you're ready, we can look at what's really going on." },
  { emotion: "angry", response: "I hear you. Sometimes we need to feel angry before we can feel anything else. You're safe here." },
  { emotion: "happy", response: "I'm so glad you're feeling good. Joy is worth savoring. What's been lighting you up lately?" },
  { emotion: "happy", response: "That's beautiful. Moments like this matter. Is there someone you'd like to share this with?" },
  { emotion: "happy", response: "It's wonderful that you're in a better place. Remember this feeling when things get tough — it's part of you too." },
  { emotion: "neutral", response: "Whatever you're feeling is okay. There's no right or wrong. What do you need from this conversation?" },
  { emotion: "neutral", response: "I'm listening. Sometimes just putting words to it helps. What's on your mind?" },
  { emotion: "sad", response: "Grief and sadness can come in waves. Be gentle with yourself. You're allowed to take things one moment at a time." },
  { emotion: "sad", response: "Missing someone or something hurts. That love doesn't go away. How are you taking care of yourself today?" },
  { emotion: "anxious", response: "Uncertainty is hard. You don't have to have all the answers. What's one thing that's still true and steady for you?" },
  { emotion: "anxious", response: "It's okay to feel scared. You've gotten through hard moments before. What helped you then?" },
  { emotion: "stressed", response: "You're doing a lot. It's okay to ask for help or to say no. What would 'good enough' look like for today?" },
  { emotion: "stressed", response: "Burnout is real. Pushing through isn't the only option. What would rest look like for you, even for 10 minutes?" },
  { emotion: "angry", response: "Being angry doesn't make you a bad person. It often means a boundary was crossed. What do you need to feel respected?" },
  { emotion: "neutral", response: "Some days we just need to be heard. I'm here. What would feel good to share?" },
  { emotion: "neutral", response: "You don't have to have it all figured out. We can take this one step at a time." },
  { emotion: "happy", response: "Celebrate the good days. They're part of your story too. What made today a little brighter?" },
  { emotion: "sad", response: "Crying doesn't mean you're weak. It often means you care. Let yourself feel what you feel." },
  { emotion: "anxious", response: "Grounding can help: name 3 things you can see, 2 you can hear, 1 you can touch. Want to try it?" },
  { emotion: "anxious", response: "The future can feel scary. Right now, in this moment, you're here. What's one thing that's okay right now?" },
  { emotion: "stressed", response: "Priorities can wait. Your wellbeing can't. What's one way you could be kind to yourself in the next hour?" },
  { emotion: "angry", response: "It's okay to need space. Sometimes we need to step back before we can talk. I'll still be here." },
  { emotion: "neutral", response: "Every small step counts. You showed up today — that matters." },
  { emotion: "sad", response: "Loneliness is painful. You're not alone in feeling alone. Would it help to name what you wish someone would say?" },
  { emotion: "happy", response: "Gratitude can anchor us. What's one thing you're grateful for today, even something small?" },
  { emotion: "neutral", response: "There's no script for this. Whatever you're feeling, it's valid. What do you need right now?" },
  { emotion: "anxious", response: "Worry often imagines the worst. What's one thing that could go okay? Even a small possibility?" },
  { emotion: "stressed", response: "You're allowed to not be productive. Rest is productive. What would real rest look like for you?" },
  { emotion: "sad", response: "Hope can feel far away sometimes. It's okay to not feel hopeful. I'm still here with you." },
  { emotion: "angry", response: "Fairness matters. It's okay to be upset when things feel unfair. What would feel more fair to you?" },
  { emotion: "happy", response: "I'm glad you're sharing this with me. Good moments deserve to be noticed. What made it good?" },
  { emotion: "neutral", response: "You're allowed to change your mind. You're allowed to not know. What feels true for you right now?" },
  { emotion: "sad", response: "Healing isn't linear. Some days will be harder. That doesn't mean you're not moving forward." },
  { emotion: "anxious", response: "Your body might be in fight-or-flight. Slow breaths can help signal safety. Want to try breathing with me for a moment?" },
  { emotion: "stressed", response: "One task at a time. You don't have to do it all at once. What's the very next small step?" },
  { emotion: "neutral", response: "Sometimes we just need to vent. I'm listening. No judgment." },
  { emotion: "happy", response: "Hold onto this feeling when you can. It's part of what makes you you." },
  { emotion: "sad", response: "It's okay to need comfort. You deserve care. What would feel comforting right now?" },
  { emotion: "angry", response: "You're not too much. Your feelings matter. What would you need to feel heard?" },
  { emotion: "neutral", response: "I'm here for you. Whatever comes up, we can work through it together." },
];

let responseIndex = 0;

export function getNextResponse() {
  const i = responseIndex % PREMADE_RESPONSES.length;
  responseIndex += 1;
  return PREMADE_RESPONSES[i];
}

export function getResponseForInput(input = "") {
  const lowerInput = input.toLowerCase();
  
  const keywords = {
    sad: ["sad", "cry", "tears", "depressed", "down", "miss", "grief", "lonely", "alone", "hurt"],
    anxious: ["anxious", "worry", "worried", "panic", "scared", "fear", "nervous", "overthinking", "sleep"],
    stressed: ["stressed", "stress", "overwhelmed", "tired", "exhausted", "work", "burnout", "too much", "busy"],
    angry: ["angry", "mad", "hate", "frustrated", "annoyed", "unfair", "furious", "upset"],
    happy: ["happy", "good", "great", "joy", "calm", "peace", "better", "glad", "smile"]
  };

  let detectedEmotion = "neutral";
  
  for (const [emotion, words] of Object.entries(keywords)) {
    if (words.some(w => lowerInput.includes(w))) {
      detectedEmotion = emotion;
      break;
    }
  }

  // Filter responses by detected emotion
  const matchingResponses = PREMADE_RESPONSES.filter(r => r.emotion === detectedEmotion);
  
  // If no responses match (shouldn't happen with our list, but fallback safe)
  if (matchingResponses.length === 0) {
    return PREMADE_RESPONSES[Math.floor(Math.random() * PREMADE_RESPONSES.length)];
  }

  return matchingResponses[Math.floor(Math.random() * matchingResponses.length)];
}

export function getRandomResponse() {
  return PREMADE_RESPONSES[Math.floor(Math.random() * PREMADE_RESPONSES.length)];
}
