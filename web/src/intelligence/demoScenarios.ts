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
    title: '1. Standard Baseline Traffic',
    description: 'A regular flow with standard calendar meetings and asynchronous technical documents.',
    events: (baseTime) => [
      {
        id: 'scen_norm_1',
        packageName: 'com.google.android.gm',
        appName: 'Gmail',
        title: 'Architecture Review: Micro-kernels',
        text: 'The engineering team shared the updated RFC specification.',
        category: 'email',
        timestamp: baseTime - 180000,
        sourceType: 'SIMULATED'
      },
      {
        id: 'scen_norm_2',
        packageName: 'com.google.android.calendar',
        appName: 'Calendar',
        title: 'Executive Sync in 30 Minutes',
        text: 'Quarterly Attention Infrastructure Planning.',
        category: 'reminder',
        timestamp: baseTime - 60000,
        sourceType: 'SIMULATED'
      }
    ]
  },
  {
    id: 'storm',
    title: '2. Interruption Storm (Burst Stress Test)',
    description: 'High-frequency burst of 8 promotional and algorithmic engagement alerts within 30s triggering the rolling window burst detector.',
    events: (baseTime) => {
      const apps = [
        ['com.instagram.android', 'Instagram', 'Someone liked your recent update', 'social'],
        ['com.snapchat.android', 'Snapchat', 'Keep your continuous streak alive!', 'social'],
        ['com.flipkart.android', 'E-Store', 'Flash Sale: 70% off electronics ending in 10m!', 'promo'],
        ['in.swiggy.android', 'Food Delivery', 'Special dinner offer available nearby', 'promo'],
        ['com.twitter.android', 'Network', 'Trending topic: System Reliability Engineering', 'social'],
        ['com.whatsapp', 'Messaging Hub', 'Team: 18 unread messages in group', 'msg'],
        ['com.amazon.mShop.android.shopping', 'Retail Platform', 'Price dropped on an item in your wishlist', 'promo'],
        ['com.spotify.music', 'Audio Service', 'Your focus playlist has been updated', 'recommendation']
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
    title: '3. Repetitive Marketing Harassment',
    description: 'Single e-commerce vendor spamming repeated countdown alerts, testing deduplication and dark-pattern detection.',
    events: (baseTime) => [
      {
        id: 'scen_rep_1',
        packageName: 'com.shopping.deals',
        appName: 'SuperDeals',
        title: 'Flash Sale Alert',
        text: 'Hurry! 50% discount on headphones expires in 15 mins!',
        category: 'promo',
        timestamp: baseTime - 40000,
        sourceType: 'SIMULATED'
      },
      {
        id: 'scen_rep_2',
        packageName: 'com.shopping.deals',
        appName: 'SuperDeals',
        title: 'Flash Sale Alert',
        text: 'Hurry! 50% discount on headphones expires in 10 mins!',
        category: 'promo',
        timestamp: baseTime - 20000,
        sourceType: 'SIMULATED'
      },
      {
        id: 'scen_rep_3',
        packageName: 'com.shopping.deals',
        appName: 'SuperDeals',
        title: 'Flash Sale Alert',
        text: 'Final Call! Flash sale closing in 2 minutes!',
        category: 'promo',
        timestamp: baseTime - 5000,
        sourceType: 'SIMULATED'
      }
    ]
  },
  {
    id: 'critical',
    title: '4. Critical Urgency Bypass During Focus',
    description: 'A bank two-factor OTP verification and VIP contact phone call cleanly bypasses an active focus gateway.',
    events: (baseTime) => [
      {
        id: 'scen_crit_1',
        packageName: 'com.sbi.banking',
        appName: 'Secure Bank',
        title: 'Security Alert: Two-Factor OTP',
        text: 'Your authorization verification code is 849201. Valid for 10 minutes.',
        category: 'msg',
        timestamp: baseTime - 12000,
        sourceType: 'SIMULATED'
      },
      {
        id: 'scen_crit_2',
        packageName: 'com.google.android.dialer',
        appName: 'Phone',
        title: 'Urgent Call',
        text: 'Priority Contact (+1 555-0199) - Calling',
        category: 'call',
        timestamp: baseTime - 2000,
        sourceType: 'SIMULATED'
      }
    ]
  },
  {
    id: 'study',
    title: '5. Deep Work / Airlock Routing',
    description: 'Non-urgent community chats and discussion threads are quietly routed to the Attention Airlock during active work blocks.',
    events: (baseTime) => [
      {
        id: 'scen_study_1',
        packageName: 'com.discord',
        appName: 'Discord',
        title: '#general discussion',
        text: 'Team member shared a new research paper on cognitive load.',
        category: 'social',
        timestamp: baseTime - 25000,
        sourceType: 'SIMULATED'
      },
      {
        id: 'scen_study_2',
        packageName: 'com.reddit.frontpage',
        appName: 'Tech Feed',
        title: 'r/architecture',
        text: 'Zero-latency local-first software design patterns.',
        category: 'recommendation',
        timestamp: baseTime - 8000,
        sourceType: 'SIMULATED'
      }
    ]
  },
  {
    id: 'learning',
    title: '6. Adaptive Local Weight Adjustment',
    description: 'Demonstrates deterministic local heuristic adaptation after user feedback modifies category weights.',
    events: (baseTime) => [
      {
        id: 'scen_learn_1',
        packageName: 'com.medium.reader',
        appName: 'Tech Daily',
        title: 'Engineering Deep Dive',
        text: 'Designing resilient offline attention firewalls without remote telemetry tracking.',
        category: 'recommendation',
        timestamp: baseTime,
        sourceType: 'SIMULATED'
      }
    ]
  }
];
