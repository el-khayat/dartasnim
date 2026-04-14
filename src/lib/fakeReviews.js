const reviewerNames = [
  'Sarah M.', 'Ahmed K.', 'Marie L.', 'Karim B.', 'Yasmine D.',
  'Jean-Pierre R.', 'Fatima Z.', 'Omar S.', 'Isabella C.', 'Mohammed A.',
  'Sophie V.', 'Nadia H.', 'Lucas T.', 'Amina F.', 'Djamel M.',
  'Charlotte B.', 'Rachid N.', 'Leila A.', 'Thomas G.', 'Samira E.',
]

const reviewTexts = [
  "Absolutely stunning fragrance. The longevity is incredible — I can still smell it after 12 hours.",
  "This has become my signature scent. I get compliments everywhere I go.",
  "The opening is beautiful, and it dries down to something even more captivating.",
  "Perfect for special occasions. The bottle design is also gorgeous.",
  "A true masterpiece. The scent profile evolves beautifully throughout the day.",
  "I bought this as a gift and ended up getting one for myself too!",
  "Very sophisticated and elegant. Not overpowering at all.",
  "The sillage is perfect — noticeable but not overwhelming.",
  "One of the best perfumes I've ever owned. Worth every penny.",
  "Reminds me of walking through a garden after rain. Magical.",
  "This perfume has such depth and complexity. Each note reveals itself gradually.",
  "I've been wearing this for months and I'm still discovering new facets.",
  "Excellent projection and longevity. A true luxury experience.",
  "The oud in this is so smooth and refined, not harsh at all.",
  "A gorgeous blend that works beautifully in any season.",
  "My partner loves this on me. It's become our favorite.",
  "Truly exceptional quality. You can tell this is made with premium ingredients.",
  "The transition from top notes to base notes is seamless and beautiful.",
  "I've tried many perfumes, but this one stands out from everything else.",
  "Elegant, refined, and long-lasting. Everything I look for in a fragrance.",
]

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

export function generateReviews(productId, count = 12) {
  const seed = hashString(productId)
  const rng = seededRandom(seed)

  const reviews = []
  const usedNames = new Set()
  const usedTexts = new Set()

  for (let i = 0; i < count; i++) {
    let nameIdx = Math.floor(rng() * reviewerNames.length)
    while (usedNames.has(nameIdx) && usedNames.size < reviewerNames.length) {
      nameIdx = (nameIdx + 1) % reviewerNames.length
    }
    usedNames.add(nameIdx)

    let textIdx = Math.floor(rng() * reviewTexts.length)
    while (usedTexts.has(textIdx) && usedTexts.size < reviewTexts.length) {
      textIdx = (textIdx + 1) % reviewTexts.length
    }
    usedTexts.add(textIdx)

    const ratingRoll = rng()
    let rating
    if (ratingRoll < 0.05) rating = 2
    else if (ratingRoll < 0.1) rating = 3
    else if (ratingRoll < 0.4) rating = 4
    else rating = 5

    const daysAgo = Math.floor(rng() * 365) + 1
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)

    reviews.push({
      id: `${productId}-review-${i}`,
      name: reviewerNames[nameIdx],
      rating,
      text: reviewTexts[textIdx],
      date: date.toISOString().split('T')[0],
      verified: rng() > 0.2,
    })
  }

  return reviews.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getStarDistribution(reviews) {
  const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach(r => { dist[r.rating] = (dist[r.rating] || 0) + 1 })
  return dist
}
