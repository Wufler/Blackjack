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
                src: '/512.png',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: "/192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "maskable"
            },
        ],
    }
}