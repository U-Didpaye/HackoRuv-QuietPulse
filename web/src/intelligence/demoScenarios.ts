import { NotificationEvent } from '../types';

export interface DemoScenario {
  id: string;
  title: string;
  description: string;
  events: (baseTime: number) => NotificationEvent[];
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'normal',
    title: '1. Normal Day Traffic',
    description: 'A regular flow with standard email updates and calendar invitations.',
    events: (baseTime) => [
      {
        id: 'scen_norm_1',
        packageName: 'com.google.android.gm',
        appName: 'Gmail',
        title: 'Project Roadmap Review',
        text: 'Arnav sent you the updated presentation slides for tomorrow.',
        category: 'email',
        timestamp: baseTime - 180000,
        sourceType: 'SIMULATED'
      },
      {
        id: 'scen_norm_2',
        packageName: 'com.google.android.calendar',
        appName: 'Calendar',
        title: 'CASCADE \'26 Hackathon Check-in',
        text: 'Event starts in 30 minutes in Auditorium Hall B.',
        category: 'reminder',
        timestamp: baseTime - 60000,
        sourceType: 'SIMULATED'
      }
    ]
  },
  {
    id: 'storm',
    title: '2. Interruption Storm (Burst)',
    description: 'Rapid burst of 8 promotional and social notifications within 30s triggering the burst detector.',
    events: (baseTime) => {
      const apps = [
        ['com.instagram.android', 'Instagram', 'Someone liked your recent reel', 'social'],
        ['com.snapchat.android', 'Snapchat', 'Keep your 42-day streak alive!', 'social'],
        ['com.flipkart.android', 'Flipkart', 'Flash Sale: 70% off electronics ending in 10m!', 'promo'],
        ['in.swiggy.android', 'Swiggy', 'Craving biryani? Extra 100 off with code HUNGRY', 'promo'],
        ['com.twitter.android', 'X', 'Trending in India: #CASCADE26 #IIITNagpur', 'social'],
        ['com.whatsapp', 'WhatsApp', '[Meme Hub] 18 new unread messages', 'msg'],
        ['com.amazon.mShop.android.shopping', 'Amazon', 'Price dropped on an item in your wishlist', 'promo'],
        ['com.spotify.music', 'Spotify', 'Your Discover Weekly is ready for playback', 'recommendation']
      ];
      return apps.map(([pkg, name, text, cat], i) => ({
        id: `scen_storm_${i}`,
        packageName: pkg,
        appName: name,
        title: name,
        text,
        category: cat,
        timestamp: baseTime - (apps.length - i) * 3000,
        sourceType: 'SIMULATED'
      }));
    }
  },
  {
    id: 'repetitive',
    title: '3. Repetitive Shopping Spam',
    description: 'Single shopping app spamming repeated alerts testing de-duplication and dark-pattern detection.',
    events: (baseTime) => [
      {
        id: 'scen_rep_1',
        packageName: 'com.shopping.deals',
        appName: 'SuperDeals',
        title: 'Deal of the Hour',
        text: 'Hurry! 50% discount on headphones expires in 15 mins!',
        category: 'promo',
        timestamp: baseTime - 40000,
        sourceType: 'SIMULATED'
      },
      {
        id: 'scen_rep_2',
        packageName: 'com.shopping.deals',
        appName: 'SuperDeals',
        title: 'Deal of the Hour',
        text: 'Hurry! 50% discount on headphones expires in 10 mins!',
        category: 'promo',
        timestamp: baseTime - 20000,
        sourceType: 'SIMULATED'
      },
      {
        id: 'scen_rep_3',
        packageName: 'com.shopping.deals',
        appName: 'SuperDeals',
        title: 'Deal of the Hour',
        text: 'Final Call! Flash sale closing in 2 minutes!',
        category: 'promo',
        timestamp: baseTime - 5000,
        sourceType: 'SIMULATED'
      }
    ]
  },
  {
    id: 'critical',
    title: '4. Critical Urgency During Focus',
    description: 'A bank OTP and family emergency call breaks cleanly through active Deep Work mode.',
    events: (baseTime) => [
      {
        id: 'scen_crit_1',
        packageName: 'com.sbi.banking',
        appName: 'SBI YONO',
        title: 'Security Alert: OTP',
        text: 'Your OTP for verification code is 849201. Valid for 10 minutes.',
        category: 'msg',
        timestamp: baseTime - 12000,
        sourceType: 'SIMULATED'
      },
      {
        id: 'scen_crit_2',
        packageName: 'com.google.android.dialer',
        appName: 'Phone',
        title: 'Urgent Call',
        text: 'Mom (+91 98230 XXXXX) - Calling',
        category: 'call',
        timestamp: baseTime - 2000,
        sourceType: 'SIMULATED'
      }
    ]
  },
  {
    id: 'study',
    title: '5. Deep Work / Study Airlock',
    description: 'Discord pings and Reddit notifications are quietly routed to Attention Airlock during study.',
    events: (baseTime) => [
      {
        id: 'scen_study_1',
        packageName: 'com.discord',
        appName: 'Discord',
        title: '#general in CS26',
        text: 'Anyone free for a quick gaming session?',
        category: 'social',
        timestamp: baseTime - 25000,
        sourceType: 'SIMULATED'
      },
      {
        id: 'scen_study_2',
        packageName: 'com.reddit.frontpage',
        appName: 'Reddit',
        title: 'r/developers',
        text: 'Top 10 software architectural patterns for 2026',
        category: 'recommendation',
        timestamp: baseTime - 8000,
        sourceType: 'SIMULATED'
      }
    ]
  },
  {
    id: 'learning',
    title: '6. Adaptive Local Learning',
    description: 'Demonstrates immediate adaptation after a user corrects an app classification.',
    events: (baseTime) => [
      {
        id: 'scen_learn_1',
        packageName: 'com.medium.reader',
        appName: 'Medium',
        title: 'Daily Tech Briefing',
        text: 'How to build privacy-first attention firewalls without cloud tracking.',
        category: 'recommendation',
        timestamp: baseTime,
        sourceType: 'SIMULATED'
      }
    ]
  }
];
