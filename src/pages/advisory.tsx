"use client";
import type { NextPage } from "next";
import Footer from "@/components/homepage/footer";
import NavBar from "@/components/NavBar";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { AiOutlineClose } from "react-icons/ai";

import Header from "@/components/Header";
import TopLines from "@/components/TopLines";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config.js";

const fullConfig = resolveConfig(tailwindConfig);

const modalBoxStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "1068px",
  maxHeight: "100vh",
  color: "white",
  bgcolor: "#1e1e1e",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  paddingTop: "10px",
  overflowY: "auto",
};

const modalBtnStyle = {
  fontFamily: "nunito",
  marginTop: "10px",
  fontSize: "1em",
  fontWeight: 700,
  width: "unset",
  color: `${fullConfig.theme.colors["darkorchid"]}`,
  textTransform: "uppercase",
};

const Advisory: NextPage = () => {
  const people = {
    hassanatu: {
      name: "Hassanatu Blake",
      affiliation: "NACCHO",
      image: "../../images/950782b72cb224fe4c5412d29ac8232b.png",
      text: `Ms. Hassanatu Blake has a diverse perspective to public health with over 15 years of experience working across multiple sectors intersecting with public health. Currently, Hassanatu is the Director of ...`,
      category: "stakeholder",
      long: [
        "Ms. Hassanatu Blake has a diverse perspective to public health with over 15 years of experience working across multiple sectors intersecting with public health. Currently, Hassanatu is the Director of Health Equity and Social Justice at National Association of City and County Health Officials (NACCHO) in Washington, DC.",
        "Outside of her public health work, Hassanatu is passionate about Education Technology and the future of learning. She is Adjunct Faculty at Brooklyn College and Tufts University School of Medicine teaching public health education and led a global EdTech non-profit organization as Co-Founder and President at Focal Point Global, which empowered over 20,000 youth and families in US, The Gambia, South Africa, Namibia, and Cameroon. Currently, she co-hosts a podcast that discusses all things EdTech.",
        "Hassanatu holds degrees from Tufts University (B.A.), Emory Rollins School of Public Health (MPH), and Plymouth State University (MBA). She is currently a PhD candidate at the University of Alabama at Birmingham with a focus on digital health, and health education and promotion.",
      ],
    },
    german: {
      name: "Germán Cadenas",
      affiliation: "Rutgers University",
      image: "../../images/a21bdb2d31a8ee99bfbec48165ca6a41.png",
      text: `Dr. Germán A. Cadenas (he/his/el) is an Assistant Professor of Counseling Psychology at Lehigh University. He is a formerly undocumented immigrant from Latin America. As a ...`,
      category: "stakeholder",
      long: [
        "Dr. Germán A. Cadenas (he/his/el) is an Assistant Professor of Counseling Psychology at Lehigh University. He is a formerly undocumented immigrant from Latin America. As a scholar-activist, he has been involved in the movement for immigrant rights for over a decade. He completed a PhD in Counseling Psychology at Arizona State University, and a Doctoral Internship and Postdoctoral Fellowship at the University of California Berkeley.",
        "His academic work is community-based and focuses on the psychology of immigration and on critical consciousness as a tool for social justice. He particularly examines the impact of immigration policy on the psychological wellbeing, education, career/work, and health of Latinx immigrants. His work also includes the development and validation of strategies for mental health service providers and educators working with immigrants. His work has been externally funded and published widely. He serves as Associate Editor of Journal of Counseling Psychology, and is on the Editorial Boards of Journal of Diversity in Higher Education and Journal of Career Development.",
        "Dr. Cadenas has informed policy and advocacy at the local, state, and national levels. This includes advocacy for higher education access of undocumented students, grassroots advocacy for humane federal immigration policies, and briefing Congress on research conducted with the National Latinx Psychological Association (NLPA) regarding COVID-19 among Latinxs. He serves on the APA Advocacy Coordinating Committee and as Vice President for Diversity and Public Interest in the Society of Counseling Psychology (Divisions 17 of APA). He also co-led the Interdivisional Immigration Project that developed collaborative advocacy strategies for community activists and psychologists.",
      ],
    },
    amena: {
      name: "Amena Karim",
      affiliation: "Community & UniteUs",
      image: "../../images/4f87fe19d34b2b18b068c93bf367e462.png",
      text: `Amena Karim has spent her career serving marginalized communities for more than 20 years. She is a multi-award-winning health equity advocate, keynote speaker, and mayoral-appointed ...`,
      category: "stakeholder",
      long: [
        "Amena Karim has spent her career serving marginalized communities for more than 20 years. She is a multi-award-winning health equity advocate, keynote speaker, and mayoral-appointed community commissioner. Amena is a leader at Unite Us, the nation's leading software company bringing sectors together to improve the health and well-being of communities. She is the founder of Feeding South Shore and Feeding Chicago Families, raising more than $400,000 to address social determinants of health barriers, such as food insecurity in marginalized communities across Chicago. She graduated with a master's degree from Northwestern University. Amena is pursuing a Master of Public Health (MPH) at Harvard T. H. Chan School of Public Health.",
      ],
    },
    julia: {
      name: "Julia Koschinsky",
      affiliation: "University of Chicago",
      image: "../../images/dda955f3e323fa54c0d72c1d04af7607.png",
      text: `Julia Koschinsky is currently working on projects to integrate spatial data science with scientific reasoning to critically solve spatial data problems and avoid common cognitive and statistical ...`,
      category: "stakeholder",
      long: [
        "Julia Koschinsky is currently working on projects to integrate spatial data science with scientific reasoning to critically solve spatial data problems and avoid common cognitive and statistical pitfalls. She is the Executive Director and Senior Research Associate at the University of Chicago‘s Center for Spatial Data Science (CSDS). CSDS developed the open spatial software GeoDa, which has been downloaded over half a million times, and hosts spatial analytics lectures with over 710,000 views on its YouTube channel. She earned a PhD in urban planning with a specialization in spatial data analysis (with Luc Anselin) from the University of Illinois at Urbana-Champaign.",
      ],
    },
    qinyun: {
      name: "Qinyun Lin",
      affiliation: "University of Gothenburg",
      image: "../../images/31845248dd143077e100945096102d03.png",
      text: `Dr. Qinyun Lin is a Senior Lecturer in the School of Public Health and Community Medicine, Institute of Medicine, University of Gothenburg. Most broadly, she is a methodologist ...`,
      category: "stakeholder",
      long: [
        "Dr. Qinyun Lin is a Senior Lecturer in the School of Public Health and Community Medicine, Institute of Medicine, University of Gothenburg. Most broadly, she is a methodologist invested in humanizing quantitative research to better understand mechanisms underlying inequities, particularly health and educational disparities, and, ultimately, informing policymaking. Towards this, she seeks to advance and expand existing quantitative methods and the interpretation of inferences by incorporating human interactions, social and spatial contexts, and mediating factors within these analyses.",
      ],
    },
    aresha: {
      name: "Aresha Martinez-Cardoso",
      affiliation: "University of Chicago",
      image: "../../images/9fe97ddb552718b679f561d7d2111022.png",
      text: `Aresha Martinez-Cardoso is an interdisciplinary public health researcher and Assistant Professor in the Department of Public Health Sciences. 
              Her research integrates theoretical ...`,
      category: "stakeholder",
      long: [
        "Aresha Martinez-Cardoso is an interdisciplinary public health researcher and Assistant Professor in the Department of Public Health Sciences. Her research integrates theoretical perspectives from the social sciences with epidemiological methods in public health to examine how social inequality in the US shapes population health, with a particular focus on the health of racial/ethnic groups and immigrants. Martinez-Cardoso's work interrogates how race and social inequities have been deeply embedded into our nation’s culture and institutions and traces the biosocial mechanisms by which these inequities get “under the skin” to affect health across the lifecourse.",
      ],
    },
    imelda: {
      name: "Imelda Moise",
      affiliation: "University of Miami",
      image: "../../images/919c7fedcaca7fe6e9fe49c0ddb28233.png",
      text: `Dr. Imelda K. Moise is a broadly trained health geographer, founder of DataChores and the Geography and Inequalities Lab. She has dedicated her 
              career to culturally ...`,
      category: "stakeholder",
      long: [
        "Dr. Imelda K. Moise is a broadly trained health geographer, founder of DataChores and the Geography and Inequalities Lab. She has dedicated her career to culturally responsive research and evaluation to advance health equity, and linking research to programs, policy, and practice in the US and sub-Saharan Africa. She works full-time in global public health as an Associate Professor and as Director of Global Health Studies at the University of Miami where she engages in scholarship of teaching and learning research to determine how to best prepare the next generation of geographers and global public health professionals. Her methodological expertise lies in utilizing mixed methods study designs with geospatial analysis to examine the combined effect of individual, sociocultural and contextual factors linked with health inequities. She has coordinated and evaluated various multi-partner systems-level interventions and is PI on projects working on strengthening early learning support in Miami; NIH greenness cardiovascular studies assessing disparities across Hispanic subgroups in Miami vs. San Diego and NYC. Her primary research is mostly responsive to community needs. Dr. Moise serves on the National Association of City Health Officials (NACCHO), Miami-Dade Refugee Task Force, and the Healthy Baby Taskforce (part of the Consortium for a Healthier Miami-Dade) where she lends her expertise in health, geography and equity-centered impact. She earned her MSc. and PhD from University of Illinois at Urbana-Champaign, MPH from the University of Illinois Springfield, and bachelor’s from the University of Oregon. Prior to her current position, she backstopped Illinois Department of Public Health and USAID-funded programs in LMIC where she led in many areas of system strengthening, maternal and child health, substance use and HIV sentinel surveillance, and country performance management plans.",
      ],
    },
    norma: {
      name: "Norma Padron",
      affiliation: "EmpiricaLabs",
      image: "../../images/98f681aa0bc687b1789df5fbb48a8383.png",
      text: `Norma is a Ph.D. health economist and entrepreneur. She is the CEO and Founder of EmpiricaLab, a company specializing in peer–to–peer training within 
      healthcare organizations to accelerate ...`,
      category: "stakeholder",
      long: [
        "Norma is a Ph.D. health economist and entrepreneur. She is the CEO and Founder of EmpiricaLab, a company specializing in peer–to–peer training within healthcare organizations to accelerate their digital transformation. Her career in healthcare spans over a decade, with leadership roles across academia, nonprofits, and the private sector. She built her expertise in data and technology teams at healthcare organizations, including the Mount Sinai Health System, Thomas Jefferson Health, the American Hospital Association and new ventures at Anthem Digital. Her teams have leveraged data analytics and technology to improve digital health products for patients and providers, design value-based care models, and quality and performance measurement and training for hospital systems across the country.",
        "In addition to her work in health economics and analytics, Norma has held board positions on STEM education and technology initiatives. She served as chair of the industry advisory board for an NSF Industry-University Cooperative Research Center (IURC) focused on improving healthcare through organizational transformation. She earned a Ph.D. in health policy and management from Yale University, as well as an MS in economics from Duke University; she also holds a master's degree in public health from Universitat Pompeu Fabra in Barcelona, Spain; She has a bachelor's degree in economics and Math from the University of Texas at Rio Grande Valley.",
      ],
    },
    sue: {
      name: "Sue Polis",
      affiliation: "National League of Cities",
      image: "../../images/1c5edc748e1ab9c4125afced062ba90e.png",
      text: `Sue Pechilio Polis directs the health and well-being portfolio for NLC as part of the Institute for Youth, Education and Families. The portfolio includes 
              the conceptualization ...`,
      category: "stakeholder",
      long: [
        "Sue Pechilio Polis directs the health and well-being portfolio for NLC as part of the Institute for Youth, Education and Families. The portfolio includes the conceptualization, development and implementation of Cities of Opportunity, a multi-year effort to engage mayors and city leaders in comprehensively addressing the root causes of poor health (SDOH) through an equitable policy and systems change approach. With expertise in health policy, Sue’s work spans the connection to housing, economic opportunity, mental health and substance use disorders, obesity, trauma, as well as local systems alignment and data for well-being. Prior to the National League of Cities, Mrs. Polis led the development and management of the Trust for America’s Health (TFAH) external relations and strategic partnership efforts in support of the organization’s public policy goals.",
        "Prior to joining TFAH, Mrs. Polis worked at AARP on health and financial security-related issues with an emphasis on advancing policy to address the needs of vulnerable 50+ populations. Her focus areas included health care workforce, retirement savings, consumer protection, and low-income programs such as the Supplemental Nutrition Assistance Program (SNAP) and the Low-Income Heating and Energy Assistance Program (LIHEAP). Mrs. Polis was the founding National Director of Advocacy for the American Heart Association.",
      ],
    },
    ericL: {
      name: "Eric Larson",
      affiliation: "University of Minnesota",
      image: "../../images/2ccd3af25538cfcc91248f143d7c43e2.png",
      text: `Eric Larson is a librarian (MLIS, University of Wisconsin-Madison), web architect, user-experience analyst, and senior application developer with over 17 years 
            experience building ...`,
      category: "technical",
      long: [
        "Eric Larson is a librarian (MLIS, University of Wisconsin-Madison), web architect, user-experience analyst, and senior application developer with over 17 years experience building increasingly complex web-based tools and services within academia and for private enterprise. He has extensive open source software experience as a core contributor to the GeoBlacklight project, and has worked as the Lead Developer for the Big Ten Academic Alliance Geoportal for the last six years. Eric has completed GeoBlacklight consulting contracts for Johns Hopkins University, New York University, University of Massachusetts-Amherst, University of Minnesota, University of Wisconsin-Madison, and the University of Wisconsin-Milwaukee. Eric is also the Co-Founder of Gimlet, an online software-as-a-service platform used by over 750 libraries internationally.",
      ],
    },
    stuart: {
      name: "Stuart Lynn",
      affiliation: "University of Chicago",
      image: "../../images/bed8b60a53ee42e06da982ec82698e23.png",
      text: `Stuart Lynn is a developer, data scientist and tinkerer whose interests involve widening the participation in scientific discussion and inquiry to non-traditional 
      communities through the ...`,
      category: "technical",
      long: [
        "Stuart Lynn is a developer, data scientist and tinkerer whose interests involve widening the participation in scientific discussion and inquiry to non-traditional communities through the development of tools and active participation in citizen science and collaborative processes. He holds a Master in Mathematical Physics and a PHD in Astrophysics from the University of Edinburgh. In previous roles he has worked with non-profits and NGOs with the Two Sigma Data Clinic, lead the Data Science team at CARTO and was the technical lead for the citizen science platform The Zooniverse. He is the lead developer of the Matico project and has built a number of other open source tools focused on understanding and using data.",
      ],
    },
    karen: {
      name: "Karen Majewicz",
      affiliation: "University of Minnesota",
      image: "../../images/8a32d07eafda96ce7048151e4d4fe56c.png",
      text: `Karen Majewicz is the Geospatial Product Manager at the University of Minnesota Libraries, where she guides application development, develops metadata workflows, 
      and curates ...`,
      category: "technical",
      long: [
        "Karen Majewicz is the Geospatial Product Manager at the University of Minnesota Libraries, where she guides application development, develops metadata workflows, and curates resources for the BTAA Geoportal. She is also the Community Coordinator for GeoBlacklight and the Vice-chair of the Minnesota Geospatial Advisory Committee’s Archiving Workgroup. Majewicz has led the development of several initiatives for the GeoBlacklight community, including the latest metadata application profile (OpenGeoMetadata-Aardvark), the bi-annual community sprints, and multiple usability studies. Her research interests include geodata archives, geospatial metadata, technical documentation, and the advocacy of free & open government data.",
      ],
    },
    ericP: {
      name: "Eric Polley",
      affiliation: "University of Chicago",
      image: "../../images/eric-polley.png",
      text: `Eric Polley, PhD is an Associate Professor in the Department of Public Health Sciences at The University of Chicago where he is the director of the Biostatistics 
      Laboratory and the faculty ...`,
      link: "",
      category: "technical",
      long: [
        "Eric Polley, PhD is an Associate Professor in the Department of Public Health Sciences at The University of Chicago where he is the director of the Biostatistics Laboratory and the faculty director for the Data Science concentration in the Master of Public Health program. Dr. Polley was previously an Assistant Professor of Biostatistics in the Department of Quantitative Health Sciences at Mayo Clinic (2015-2021) and a mathematical statistician in the Biometric Research Branch at the U.S. National Cancer Institute (2012-2015). Dr. Polley received his PhD in biostatistics from the University of California, Berkeley in 2010. His research area involves the development and evaluation of prediction methods, innovative methods for diagnostic and prognostic prediction, and precision medicine clinical trial design.",
      ],
    },
    evan: {
      name: "Evan Thornberry",
      affiliation: "University of British Columbia",
      image: "../../images/c5cc87e8890dfa43ab9ae9449e061a37.png",
      text: `Evan Thornberry is the Geographic Information Systems (GIS) Librarian at the University of British Columbia (UBC) Library where he supports teaching, learning, 
      and research with ...`,
      link: "",
      category: "technical",
      long: [
        "Evan Thornberry is the Geographic Information Systems (GIS) Librarian at the University of British Columbia (UBC) Library where he supports teaching, learning, and research with geospatial information and technology. In his work, he coordinates efforts to improve existing resources for maps, atlases, and geodata collections, as well as library services to better equip a large base of GIS users. Evan recently finished his work as a co-principal investigator for the Geodisy project which improves the discoverability of geospatial research data across Canada. Evan was also recently a co-principal investigator for a project to create an openly available interactive textbook for teaching geomatics for environmental management in collaboration with UBC’s Faculty of Forestry. He is the Past-President of the Western Association of Map Libraries and an organizer of Maptime Vancouver. Previous to his role at UBC, Evan was the Reference and Geospatial Librarian for the Norman B. Leventhal Map Center at the Boston Public Library where in 2016-2017 he was the director of an NEH-funded project to build a spatial discovery layer for BPL’s large public collection of historical maps.",
      ],
    },
    jamelle: {
      name: "Jamelle Watson-Daniels",
      affiliation: "Harvard University",
      image: "../../images/bd9d32f2079d023af0ed25a15cde5bb8.png",
      text: `Jamelle Watson-Daniels is a PhD Candidate at Harvard's John A. Paulson School of Engineering and Applied Sciences. She is a Ford Foundation Pre-doctoral Fellow 
      and NSF Graduate ...`,
      link: "",
      category: "technical",
      long: [
        "Jamelle Watson-Daniels is a PhD Candidate at Harvard's John A. Paulson School of Engineering and Applied Sciences. She is a Ford Foundation Pre-doctoral Fellow and NSF Graduate Research Fellow. Jamelle has experiences at the nexus of racial justice and data science for instance she previously served as Director of Research at Data for Black Lives. Before pursuing her PhD, Watson-Daniels received a combined degree in Physics and Africana Studies from Brown University. Her broad campus leadership was recognized when she was chosen to deliver the 2016 Brown commencement address and received the Joslin Student Leadership Award as well as the Mildred Widgoff Award for excellence in physics thesis. Jamelle's ongoing research focuses on developing fair and trustworthy machine learning methods. She also supports work on data literacy, data storytelling and data science promoting social policy innovation.",
      ],
    },
    malaika: {
      name: "Malaika Simmons",
      affiliation: "NADPH of Minnesota",
      image: "../../images/9b68cb21e8356dba8758385834bf8ec5.png",
      text: `Malaika Simmons, MSHE, is the Chief Operating Officer for the National Alliance against Disparities in Patient Health (NADPH), a data-driven, nonprofit health research 
      organization. She uses her ...`,
      link: "",
      category: "technical",
      long: [
        "Malaika Simmons, MSHE, is the Chief Operating Officer for the National Alliance against Disparities in Patient Health (NADPH), a data-driven, nonprofit health research organization. She uses her background in research, psychology, and design thinking to promote empathy-based leadership with over 20 years of experience in corporate policy, training, and program management, operating at the convergence of health research, IT, and consumer issues. She currently serves as the NADPH Program Manager for the Infrastructure Core of the AIM-AHEAD Program sponsored by NIH, and leads qualitative research for several projects aimed at centering patient or community voices in health and technology-related initiatives. Malaika has a strong commitment to improving the health of underserved populations and more broadly supports these efforts through her organization Momentology Media. Through Momentology, Malaika fulfills her passion for the elimination of economic and health disparities in minority communities by using her proprietary framework to empower women to own businesses, champion health causes and enter the corporate and political landscapes to affect change in their corner of the world.",
      ],
    },
  };
  const stakeholderList = [];
  const technicalList = [];
  Object.keys(people).map(function (id, keyIndex) {
    const item = people[id];
    item.id = id;
    if (item.category === "stakeholder") {
      stakeholderList.push(item);
    } else if (item.category === "technical") {
      technicalList.push(item);
    }
  });
  const [open, setOpen] = React.useState(false);
  const [bio, setBio] = React.useState("german");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <Header title={"Advisory"} />
      <NavBar />
      <TopLines />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalBoxStyle}>
          <div>
            <Button
              sx={{
                minWidth: "unset",
                padding: 0,
                float: "right",
                marginBottom: "10px",
              }}
              onClick={handleClose}
            >
              <AiOutlineClose size={25} color="white" />
            </Button>
          </div>
          <div className="bg-orange-300 clear-both max-w-[1068px] h-1 max-md:max-w-full max-h-full" />
          <div className="self-center w-full mt-10 max-md:max-w-full">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              <div className="flex flex-col items-stretch w-3/12 max-md:w-full max-md:ml-0">
                <div className="flex flex-col max-md:mt-10">
                  <img
                    loading="lazy"
                    srcSet={people[bio].image}
                    className="aspect-[0.94] object-cover object-center w-full overflow-hidden"
                  />
                  <div className="text-2xl font-bold leading-[133.333%] mt-6">
                    {people[bio].name}
                  </div>
                  <div className="text-lg font-medium leading-[177.778%] mt-2.5">
                    {people[bio].affiliation}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-stretch w-9/12 ml-24 max-md:w-full max-md:ml-0">
                <div className="text-lg font-medium leading-[177.778%] w-[848px] max-w-full max-md:mt-10">
                  {people[bio].long.map((p, index) => (
                    <div key={index} style={{ marginBottom: "10px" }}>
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-orange-300 w-full h-1 mt-10" />
        </Box>
      </Modal>
      <div className="flex flex-col">
        <div className="self-center flex w-full max-w-[1068px] flex-col px-5 max-md:max-w-full mt-[100px]">
          <h1 className="font-fredoka" style={{ fontSize: "5rem" }}>
            Advisory
          </h1>
          <div className="self-center w-full -ml-5 mt-20 max-md:max-w-full max-md:mt-10">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              <div className="flex flex-col items-stretch w-[92%] max-md:w-full max-md:ml-0">
                <div className="text-stone-900 text-2xl leading-[133.333%] w-[1068px] max-w-[1068px] max-md:max-w-full max-md:mt-10 font-nunito">
                  The Place project has an advisory board consisting of experts
                  from public, private, and academic sectors. Their primary
                  responsibility is to provide methodological guidance, offer
                  critical and technical insights, and ensure that the PLACE
                  project aligns with the requirements of communities in the
                  United States that are disproportionately affected by health,
                  spatial, and racial disparities.
                  <br />
                  <br />
                  The members of the PLACE project advisory board combine vast
                  experience in designing complex engineering and scientific
                  solutions for both non-profit and academic settings, as well
                  as a proven track record in conducting community-based
                  research and outreach programs with minority and segregated
                  communities.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="font-nunito self-stretch flex flex-col mt-44 max-md:max-w-full max-md:mr-0.5 max-md:mt-10">
          <div className="self-center w-full max-md:max-w-full mb-32 text-stone-900 max-w-[1246px] text-2xl font-bold p-[25px] ml-18 max-md:ml-2.5">
            Stakeholder Team
          </div>
          <div className="bg-lightbisque self-stretch flex grow flex-col pb-20 px-5 max-md:max-w-full">
            <div className="self-center flex w-full max-w-[1246px] flex-col max-md:max-w-full">
              <div
                className="self-center flex w-full max-w-[1246px] flex-col mt-0.5 max-md:max-w-full"
                style={{ marginTop: "-110px" }}
              >
                <div className="self-center w-full max-md:max-w-full">
                  <div className="flex flex-wrap max-md:flex-col max-md:items-stretch max-md:gap-0">
                    {stakeholderList.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-stretch w-1/4 p-[25px] mb-[70px] max-md:w-full max-md:ml-0"
                      >
                        <div className="flex flex-col items-stretch w-full max-md:w-full max-md:ml-0">
                          <div
                            className="flex flex-col items-stretch mb-[30px] max-md:w-full max-md:ml-0"
                            style={{ paddingRight: "100px" }}
                          >
                            <img
                              loading="lazy"
                              srcSet={item.image}
                              className="aspect-[0.98] object-cover rounded-full object-center w-full overflow-hidden grow max-md:mt-10 border-4 border-solid border-lightsalmon shadow-[2px_4px_0px_0px_darkorchid]"
                            />
                          </div>
                          <div className="flex grow flex-col max-md:mt-10 font-nunito">
                            <div className="text-stone-900 text-2xl font-bold leading-[133.333%]">
                              {item.name}
                            </div>
                            <div className="text-stone-900 text-lg font-medium leading-[177.778%] mt-1">
                              {item.title}
                            </div>
                            <div className="text-stone-900 text-lg font-medium leading-[177.778%] mt-6">
                              {item.text}
                            </div>
                            <Button
                              sx={modalBtnStyle}
                              onClick={() => {
                                setBio(item.id);
                                handleOpen();
                              }}
                            >
                              Read More
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-col mt-44 max-md:max-w-full max-md:mr-0.5 max-md:mt-10">
          <div className="self-center w-full max-md:max-w-full mb-32 text-stone-900 max-w-[1246px] text-2xl font-bold p-[25px] ml-18 max-md:ml-2.5">
            Technical Team
          </div>
        </div>
        <div className="bg-lightbisque self-stretch flex mt-0 w-full flex-col pb-20 px-5 max-md:max-w-full">
          <div
            className="self-center flex w-full max-w-[1246px] flex-col mt-0.5 max-md:max-w-full"
            style={{ marginTop: "-110px" }}
          >
            <div className="self-center w-full max-md:max-w-full">
              <div className="flex flex-wrap max-md:flex-col max-md:items-stretch max-md:gap-0">
                {technicalList.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-stretch w-1/4 p-[25px] mb-[70px] max-md:w-full max-md:ml-0"
                  >
                    <div className="flex flex-col items-stretch w-full max-md:w-full max-md:ml-0">
                      <div
                        className="flex flex-col items-stretch mb-[30px] max-md:w-full max-md:ml-0"
                        style={{ paddingRight: "100px" }}
                      >
                        <img
                          loading="lazy"
                          srcSet={item.image}
                          className="aspect-[0.98] object-cover rounded-full object-center w-full overflow-hidden grow max-md:mt-10 border-4 border-solid border-lightsalmon shadow-[2px_4px_0px_0px_darkorchid]"
                        />
                      </div>
                      <div className="flex grow flex-col max-md:mt-10 font-nunito">
                        <div className="text-stone-900 text-2xl font-bold leading-[133.333%]">
                          {item.name}
                        </div>
                        <div className="text-stone-900 text-lg font-medium leading-[177.778%] mt-1">
                          {item.title}
                        </div>
                        <div className="text-stone-900 text-lg font-medium leading-[177.778%] mt-6">
                          {item.text}
                        </div>
                        <Button
                          sx={modalBtnStyle}
                          onClick={() => {
                            setBio(item.id);
                            handleOpen();
                          }}
                        >
                          Read More
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Advisory;
