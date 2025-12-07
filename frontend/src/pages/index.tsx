import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';
import '../css/custom-homepage.css';

function HomepageHeader() {

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner, 'custom-hero-banner')}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          WELCOME TO THE PHYSICAL AI & HUMANOID ROBOTICS TEXTBOOK
        </Heading>
        <p className="hero__subtitle">Start learning AI Robotics Now!</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/chapter-1-introduction-to-physical-ai">
            Start Reading →
          </Link>
          
        </div>
      </div>
    </header>
  );
}

const chapters = [
  {
    title: 'Introduction to Physical AI',
    chapter: 1,
    description: 'Learn the fundamentals of AI systems that interact with the physical world.',
    link: '/docs/chapter-1-introduction-to-physical-ai',
  },
  {
    title: 'Basics of Humanoid Robotics',
    chapter: 2,
    description: 'Explore mechanical design, actuators, sensors, and control systems.',
    link: '/docs/chapter-2-basics-of-humanoid-robotics',
  },
  {
    title: 'ROS 2 Fundamentals',
    chapter: 3,
    description: 'Master the industry-standard framework for robot software development.',
    link: '/docs/chapter-3-ros-2-fundamentals',
  },
  {
    title: 'Digital Twin Simulation',
    chapter: 4,
    description: 'Use Gazebo and Isaac Sim to test robots in virtual environments.',
    link: '/docs/chapter-4-digital-twin-simulation',
  },
  {
    title: 'Vision-Language-Action Systems',
    chapter: 5,
    description: 'Build AI models that understand vision, language, and generate actions.',
    link: '/docs/chapter-5-vision-language-action-systems',
  },
  {
    title: 'Capstone Project',
    chapter: 6,
    description: 'Integrate all concepts to build a complete AI-robot pipeline.',
    link: '/docs/chapter-6-capstone-ai-robot-pipeline',
  },
];

function ChapterCard({chapter, title, description, link}) {
  return (
    <div className="col col--4">
      <div className="card margin-bottom--lg custom-chapter-card">
        <div className="card__header">
          <Heading as="h3">Chapter {chapter}</Heading>
        </div>
        <div className="card__body">
          <Heading as="h4" className="custom-chapter-title">{title}</Heading>
          <p>{description}</p>
        </div>
        <div className="card__footer">
          <Link to={link} className="button button--primary button--block">Read Chapter</Link>
        </div>
      </div>
    </div>
  );
}

export default function Home(): React.ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Physical AI & Humanoid Robotics Textbook"
      description="Learn to build intelligent physical systems with ROS 2, simulation, and AI models">
      <HomepageHeader />
      <main>
        <section className="chapter-cards-section">
          <div className="container">
            <Heading as="h2" className="text--center">Table of Contents</Heading>
            <div className="row">
              {chapters.map((props, idx) => (
                <ChapterCard key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
