import React from 'react';
import ProjectCard from '../components/ProjectCard/ProjectCard';
import './Projects.css';

const projects = [
  {
    id: 1,
    title: 'Fun Project One',
    description: 'This was such a fun one to build! I learned a ton while working on it.',
    technologies: ['React', 'Node.js', 'MongoDB'],
    link: '#'
  },
  {
    id: 2,
    title: 'Cool Project Two',
    description: 'I really enjoyed solving the challenges on this one. Check it out!',
    technologies: ['Python', 'Django', 'PostgreSQL'],
    link: '#'
  },
  {
    id: 3,
    title: 'Awesome Project Three',
    description: 'A side project that turned out way better than I expected!',
    technologies: ['JavaScript', 'Express', 'Redis'],
    link: '#'
  }
];

function Projects() {
  return (
    <div className="projects">
      <section className="projects-header">
        <h1>Some Things I've Built</h1>
        <p>I'm really proud of these — hope you like them too!</p>
      </section>
      
      <section className="projects-grid">
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            technologies={project.technologies}
            link={project.link}
          />
        ))}
      </section>
    </div>
  );
}

export default Projects;
