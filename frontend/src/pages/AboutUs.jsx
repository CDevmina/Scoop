import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import styles from "./CSS/AboutUs.module.css";

// Images for Hero Section
import heroImage from "../assets/images/AboutUs/5.jpg";

// Images for Branches Section
import sydneyImage from "../assets/images/AboutUs/1.jpg";
import teatroImage from "../assets/images/AboutUs/2.jpg";
import granTeatreImage from "../assets/images/AboutUs/4.jpg";
import palaisImage from "../assets/images/AboutUs/3.jpg";

// Images for Team Section
import gaganaImage from "../assets/images/ProfilePics/Gagana.jpg";
import lakkithaImage from "../assets/images/ProfilePics/Lakkitha.jpg";
import chamathImage from "../assets/images/ProfilePics/Chamath.jpg";
import janudaImage from "../assets/images/ProfilePics/Januda.jpg";
import kusalImage from "../assets/images/ProfilePics/Kusal.jpeg";

// FontAwesome imports for TeamSection icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faLinkedin,
  faGithub,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

// ========================
// 1) Hero Section
// ========================
const HeroSection = () => {
  return (
    <div className={styles.heroSection}>
      <img src={heroImage} alt="Cinema Overview" className={styles.heroImage} />
    </div>
  );
};

// ========================
// 2) About Section
// ========================
const AboutSection = () => {
  return (
    <section className={styles.aboutSection}>
      <h2 className={styles.sectionTitle}>About Scoop Cinema</h2>
      <p className={styles.sectionText}>
        Welcome to Scoop Cinema, where storytelling comes to life. Founded with
        a passion for creating exceptional experiences, we are committed to
        redefining entertainment by connecting people through the magic of
        cinema. At Scoop Cinema, we believe every story has the power to
        inspire, engage, and transform. With state-of-the-art technology,
        immersive environments, and a dedication to quality, we provide
        unforgettable moments for movie enthusiasts of all ages. From
        blockbuster hits to timeless classics, our theaters are a haven for
        those who appreciate the art of filmmaking. Join us as we continue to
        celebrate the magic of stories—one frame at a time.
      </p>
    </section>
  );
};

// ========================
// 3) Vision & Mission Section
// ========================
const VisionMissionSection = () => {
  return (
    <section className={styles.visionMissionSection}>
      <div className={styles.visionMissionContainer}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Vision</h3>
          <p className={styles.cardText}>
            To be the most trusted and innovative destination for cinematic
            storytelling, inspiring audiences and shaping the future of
            entertainment. We strive to connect people through the universal
            language of film, fostering creativity and leaving a lasting
            cultural impact.
          </p>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Mission</h3>
          <p className={styles.cardText}>
            Our mission is to create extraordinary cinematic experiences that
            captivate and inspire. Through cutting-edge technology, exceptional
            service, and a passion for storytelling, we aim to bring communities
            together and celebrate the power of film.
          </p>
        </div>
      </div>
    </section>
  );
};

// ========================
// 4) Branches Section
// ========================
const BranchesSection = () => {
  const branches = [
    {
      name: "Sydney Opera House",
      details: "Digital 2D | Digital 3D | IMAX",
      url: "https://maps.app.goo.gl/6pB7cLdem5SYEwms9",
      image: sydneyImage,
    },
    {
      name: "Teatro Colón",
      details: "Digital 2D | Digital 3D | IMAX",
      url: "https://maps.app.goo.gl/VCF5Md7GFqWvhK7DA",
      image: teatroImage,
    },
    {
      name: "Gran Teatre del Liceu",
      details: "Digital 2D | Dolby Atmos",
      url: "https://maps.app.goo.gl/B42hpf9kCUBtwWcN6",
      image: granTeatreImage,
    },
    {
      name: "Palais Garnier",
      details: "Digital 3D | Dolby Atmos",
      url: "https://maps.app.goo.gl/DWrpm4YyznDFrbzX9",
      image: palaisImage,
    },
  ];

  return (
    <section className={styles.branchesSection}>
      <h2 className={styles.sectionTitle}>Our Branches</h2>
      <div className={styles.branchesContainer}>
        {branches.map((branch, index) => (
          <div key={index} className={styles.branchCard}>
            <img
              src={branch.image}
              alt={branch.name}
              className={styles.branchImage}
            />
            <h3 className={styles.branchTitle}>{branch.name}</h3>
            <p className={styles.branchDetails}>{branch.details}</p>
            <Button text="View Location" url={branch.url} />
          </div>
        ))}
      </div>
    </section>
  );
};

// ========================
// 5) Team Section
// ========================
const TeamSection = () => {
  const team = [
    {
      name: "Lakkitha Niwunhella",
      role: "Frontend Developer",
      tags: "#Frontend",
      image: lakkithaImage,
      social: {
        email: "mailto:lakkithadocs@gmail.com",
        linkedin: "https://www.linkedin.com/in/lakkitha-niwunhella/",
        github: "https://github.com/lakkitha",
        instagram: "https://www.instagram.com/lakkitha_c/",
        twitter: "https://x.com/Lakkitha_N",
      },
    },
    {
      name: "Kusal Gedara",
      role: "Backend Developer",
      tags: "#GameDev #.NET",
      image: kusalImage,
      social: {
        email: "mailto:kusal@example.com",
        linkedin: "https://www.linkedin.com/in/kusal-videshan/",
        github: "https://github.com/theRealUnd3rdog",
        instagram: "https://www.instagram.com/underdogdev/",
        twitter: "https://x.com/unde3dog",
      },
    },
    {
      name: "Gagana Methmal",
      role: "Software Developer",
      tags: "#DevOps #FullStack",
      image: gaganaImage,
      social: {
        email: "mailto:gagana220@icloud.com",
        linkedin: "https://lk.linkedin.com/in/gagana-methmal",
        github: "https://github.com/iamgaganam",
        instagram: "https://www.instagram.com/iam_gagana_m/",
        twitter: "",
      },
    },
    {
      name: "Chamath Devmina",
      role: "Full Stack Developer",
      tags: "#FullStack #React",
      image: chamathImage,
      social: {
        email: "mailto:chamathdewmina25@gmail.com",
        linkedin: "https://www.linkedin.com/in/chamath-devmina/",
        github: "https://github.com/CDevmina",
        instagram: "https://www.instagram.com/c_devmina",
        twitter: "https://x.com/cdevmina?s=21",
      },
    },
    {
      name: "Aveen Fernando",
      role: "UI/UX & Frontend Developer",
      tags: "#UX #UI #Frontend",
      image:
        "https://wallpapers.com/images/featured/cool-profile-picture-87h46gcobjl5e4xu.jpg",
      social: {
        email: "mailto:fernando.nithila@gmail.com",
        linkedin: "https://www.linkedin.com/in/aveen-fernando/",
        github: "https://github.com/AveenFernando",
        instagram: "https://www.instagram.com/",
        twitter: "https://x.com/AveenFernando",
      },
    },
    {
      name: "Januda Abeysinghe",
      role: "UI/UX Designer",
      tags: "#QA #Testing",
      image: janudaImage,
      social: {
        email: "mailto:fgryuh@example.com",
        linkedin: "https://www.linkedin.com/in/januda-abeysinghe-723556254/",
        github: "https://github.com/AbeysingheJV",
        instagram: "https://www.instagram.com/",
        twitter: "https://x.com/",
      },
    },
  ];

  return (
    <section className={styles.teamSection}>
      <h2 className={styles.sectionTitle}>Our Team</h2>
      <div className={styles.teamContainer}>
        {team.map((member, index) => (
          <div key={index} className={styles.teamCard}>
            <img
              src={member.image}
              alt={member.name}
              className={styles.teamImage}
            />
            <h3 className={styles.teamTitle}>{member.name}</h3>
            <p className={styles.teamRole}>{member.role}</p>
            <p className={styles.teamTags}>{member.tags}</p>
            <div className={styles.teamIcons}>
              <a
                href={member.social.email}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faEnvelope} />
              </a>
              <a
                href={member.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a
                href={member.social.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a
                href={member.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              {/* Only render Twitter icon if there's a link */}
              {member.social.twitter && (
                <a
                  href={member.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faXTwitter} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ========================
// Main AboutUs Component
// ========================
const AboutUs = () => {
  return (
    <div className={styles.aboutUsContainer}>
      <div className={styles.contentWrapper}>
        {/* Breadcrumb stays as its own component */}
        <Breadcrumb
          pageTitle="ABOUT US"
          breadcrumbNav={[
            { label: "Home", link: "/" },
            { label: "About Us", current: true },
          ]}
        />

        {/* All sections combined here */}
        <HeroSection />
        <AboutSection />
        <VisionMissionSection />
        <BranchesSection />
        <TeamSection />
      </div>
    </div>
  );
};

export default AboutUs;
