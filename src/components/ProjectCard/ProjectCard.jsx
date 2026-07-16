import './ProjectCard.css';

function ProjectCard({ title, description, image, link, technologies }) {
  return (
    <div className="project-card">
      {image && <img src={image} alt={title} className="project-image" />}
      <div className="project-info">
        <h3 className="project-title">{title}</h3>
        <p className="project-description">{description}</p>
        {technologies && (
          <div className="project-tech">
            {technologies.map((tech, index) => (
              <span key={index} className="tech-tag">{tech}</span>
            ))}
          </div>
        )}
        <a href={link} target="_blank" rel="noopener noreferrer" className="project-link">
          Take a Look →
        </a>
      </div>
    </div>
  );
}

export default ProjectCard;
