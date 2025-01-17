import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Blackjack',
        short_name: 'Blackjack',
        description: 'Try to build up a streak and submit your score to the leaderboard!',
        start_url: '/',
        display: 'standalone',
        background_color: '#FE0035',
        theme_color: '#FE0035',
        icons: [
            {
                src: 'https://wolfey.s-ul.eu/JwLdlXMD',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: "https://wolfey.s-ul.eu/0lykZHRD",
                sizes: "192x192",
                type: "image/png",
                purpose: "maskable"
            },
        ],
    }
}