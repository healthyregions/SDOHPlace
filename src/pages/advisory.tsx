"use client";
import Footer from "@/components/homepage/footer";
import Navbar from "@/components/homepage/navbar";
import * as React from "react";

function Advisory(props) {

  const data = {
    "advisory": `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum`,
    "team": {
      "stakeholders": [
        {
          "name": "Hassanatu Blake",
          "title": "NACCHO",
          "image": "../../images/950782b72cb224fe4c5412d29ac8232b.png",
          "text": `Ms. Hassanatu Blake has a diverse perspective to public health with over 
                  15 years of experience working across multiple sectors intersecting with public health. 
                  Currently, Hassanatu is the Director of ...`,
          "link": ""
        },
        {
          "name": "German Cadenas",
          "title": "Rutgers University",
          "image": "../../images/a21bdb2d31a8ee99bfbec48165ca6a41.png",
          "text": `Dr. Germán A. Cadenas (he/his/el) is an Assistant Professor of Counseling Psychology at Lehigh University. 
                  He is a formerly undocumented immigrant from Latin America. As a ...`,
          "link": ""
        },
        {
          "name": "Amena Karim",
          "title": "Community & UniteUs",
          "image": "../../images/4f87fe19d34b2b18b068c93bf367e462.png",
          "text": `Amena Karim has spent her career serving marginalized communities for more than 20 years. She is a multi-award-winning 
                  health equity advocate, keynote speaker, and mayoral-appointed ...`,
          "link": ""
        },
        {
          "name": "Julia Koschinsky",
          "title": "University of Chicago",
          "image": "../../images/dda955f3e323fa54c0d72c1d04af7607.png",
          "text": `Julia Koschinsky is currently working on projects to integrate spatial data science with scientific reasoning to critically solve 
                  spatial data problems and avoid common cognitive and statistical ...`,
          "link": ""
        }
      ],
      "stakeholders_two": [
        {
          "name": "Qinyun Lin",
          "title": "University of Gothenburg",
          "image": "../../images/31845248dd143077e100945096102d03.png",
          "text": `Dr. Qinyun Lin is a Senior Lecturer in the School of Public Health and Community Medicine, Institute of Medicine, University of 
                  Gothenburg. Most broadly, she is a methodologist ...`,
          "link": ""
        },
        {
          "name": "Aresha Martinez-Cardoso",
          "title": "University of Chicago",
          "image": "../../images/9fe97ddb552718b679f561d7d2111022.png",
          "text": `Aresha Martinez-Cardoso is an interdisciplinary public health researcher and Assistant Professor in the Department of Public Health Sciences. 
                  Her research integrates theoretical ...`,
          "link": ""
        },
        {
          "name": "Imelda Moise",
          "title": "University of Miami",
          "image": "../../images/919c7fedcaca7fe6e9fe49c0ddb28233.png",
          "text": `Dr. Imelda K. Moise is a broadly trained health geographer, founder of DataChores and the Geography and Inequalities Lab. She has dedicated her 
                  career to culturally ...`,
          "link": ""
        },
        {
          "name": "Norma Padron",
          "title": "EmpiricaLabs",
          "image": "../../images/98f681aa0bc687b1789df5fbb48a8383.png",
          "text": `Norma is a Ph.D. health economist and entrepreneur. She is the CEO and Founder of EmpiricaLab, a company specializing in peer–to–peer training within 
          healthcare organizations to accelerate ...`,
          "link": ""
        },
        {
          "name": "Sue Polis",
          "title": "National League of Cities",
          "image": "../../images/1c5edc748e1ab9c4125afced062ba90e.png",
          "text": `NSue Pechilio Polis directs the health and well-being portfolio for NLC as part of the Institute for Youth, Education and Families. The portfolio includes 
                  the conceptualization ...`,
          "link": ""
        }
      ],
      "technical": [
        {
          "name": "Eric Larson",
          "title": "University of Minnesota",
          "image": "../../images/2ccd3af25538cfcc91248f143d7c43e2.png",
          "text": `Eric Larson is a librarian (MLIS, University of Wisconsin-Madison), web architect, user-experience analyst, and senior application developer with over 17 years 
                experience building ...`,
          "link": ""
        },
        {
          "name": "Stuart Lynn",
          "title": "University of Chicago",
          "image": "../../images/bed8b60a53ee42e06da982ec82698e23.png",
          "text": `Stuart Lynn is a developer, data scientist and tinkerer whose interests involve widening the participation in scientific discussion and inquiry to non-traditional 
          communities through the ...`,
          "link": ""
        },
        {
          "name": "Karen Majewicz",
          "title": "University of Minnesota",
          "image": "../../images/8a32d07eafda96ce7048151e4d4fe56c.png",
          "text": `Karen Majewicz is the Geospatial Product Manager at the University of Minnesota Libraries, where she guides application development, develops metadata workflows, 
          and curates ...`,
          "link": ""
        },
        {
          "name": "Eric Polley",
          "title": "University of Chicago",
          "image": "../../images/dda955f3e323fa54c0d72c1d04af7607.png",
          "text": `Eric Polley, PhD is an Associate Professor in the Department of Public Health Sciences at The University of Chicago where he is the director of the Biostatistics 
          Laboratory and the faculty ...`,
          "link": ""
        },
        {
          "name": "Evan Thornberry",
          "title": "University of British Columbia",
          "image": "../../images/c5cc87e8890dfa43ab9ae9449e061a37.png",
          "text": `Evan Thornberry is the Geographic Information Systems (GIS) Librarian at the University of British Columbia (UBC) Library where he supports teaching, learning, 
          and research with ...`,
          "link": ""
        },
        {
          "name": "Jamelle Watson-Daniels",
          "title": "Harvard University",
          "image": "../../images/bd9d32f2079d023af0ed25a15cde5bb8.png",
          "text": `Jamelle Watson-Daniels is a PhD Candidate at Harvard's John A. Paulson School of Engineering and Applied Sciences. She is a Ford Foundation Pre-doctoral Fellow 
          and NSF Graduate ...`,
          "link": ""
        },
        {
          "name": "Malaika Simmons",
          "title": "NADPH of Minnesota",
          "image": "../../images/9b68cb21e8356dba8758385834bf8ec5.png",
          "text": `Malaika Simmons, MSHE, is the Chief Operating Officer for the National Alliance against Disparities in Patient Health (NADPH), a data-driven, nonprofit health research 
          organization. She uses her ...`,
          "link": ""
        }
      ]
    }
  }

  return (
    <>
      <Navbar />
      <div className="bg-white flex flex-col">

        <div className="self-center flex w-full max-w-[1259px] flex-col px-5 max-md:max-w-full mt-[100px]">
          <h1 style={{ fontSize: "80px" }}>
            Advisory
          </h1>
          <div className="self-center w-full -ml-5 mt-20 max-md:max-w-full max-md:mt-10">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              <div className="flex flex-col items-stretch w-[92%] max-md:w-full max-md:ml-0">
                <div className="text-stone-900 text-2xl leading-[133.333%] w-[1068px] max-w-[1068px] max-md:max-w-full max-md:mt-10">
                  {data.advisory}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-col mt-44 max-md:max-w-full max-md:mr-0.5 max-md:mt-10">
          <div className="self-center w-full max-md:max-w-full mb-32 text-stone-900 max-w-[1246px] text-2xl font-bold p-[25px] ml-18 max-md:ml-2.5">
            Stakeholder Team
          </div>
          <div className="bg-amber-100 self-stretch flex grow flex-col pb-20 px-5 max-md:max-w-full">
            <div className="self-center flex w-full max-w-[1246px] flex-col max-md:max-w-full">
              <div className="self-center flex w-full max-w-[1246px] flex-col mt-0.5 max-md:max-w-full" style={{ marginTop: "-110px" }}>
                <div className="self-center w-full max-md:max-w-full">
                  <div className="flex flex-wrap max-md:flex-col max-md:items-stretch max-md:gap-0">
                    {data["team"]["stakeholders"].map((item, index) => (
                      <div key={index} className="flex flex-col items-stretch w-1/4 p-[25px] mb-[70px] max-md:w-full max-md:ml-0">
                        <div className="flex flex-col items-stretch w-full max-md:w-full max-md:ml-0">
                          <div className="flex flex-col items-stretch mb-[30px] max-md:w-full max-md:ml-0" style={{ paddingRight: "100px" }}>
                            <img
                              loading="lazy"
                              srcSet={item.image}
                              className="aspect-[0.98] object-cover rounded-full object-center w-full overflow-hidden grow max-md:mt-10 border-4 border-solid border-lightsalmon shadow-[2px_4px_0px_0px_darkorchid]"
                            />
                          </div>
                          <div className="flex grow flex-col max-md:mt-10">
                            <div className="text-stone-900 text-2xl font-bold leading-[133.333%]">
                              {item.name}
                            </div>
                            <div className="text-stone-900 text-lg font-medium leading-[177.778%] mt-1">
                              {item.title}
                            </div>
                            <div className="text-stone-900 text-lg font-medium leading-[177.778%] mt-6">
                              {item.text}
                            </div>
                            <a href={item.link} className="text-purple-700 text-xs font-bold tracking-wide uppercase mt-9">
                              Read More
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-orange-300 w-[1247px] h-1 mt-10 max-md:max-w-full" />
              <div className="self-center w-full max-w-[1238px] mt-10 max-md:max-w-full">
                <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
                  <div className="flex flex-col items-stretch w-3/12 max-md:w-full max-md:ml-0">
                    <div className="flex flex-col max-md:mt-10">
                      <img
                        loading="lazy"
                        srcSet="../../images/a21bdb2d31a8ee99bfbec48165ca6a41.png"
                        className="aspect-[0.94] object-cover object-center w-full overflow-hidden"
                      />
                      <div className="text-stone-900 text-2xl font-bold leading-[133.333%] mt-6">
                        German Cadenas
                      </div>
                      <div className="text-stone-900 text-lg font-medium leading-[177.778%] mt-2.5">
                        Rutgers University
                      </div>
                      <div className="text-purple-700 text-lg font-medium leading-[177.778%] mt-11 max-md:mt-10">
                        LinkedIn
                      </div>
                      <div className="text-purple-700 text-lg font-medium leading-[177.778%] mt-3">
                        Google Scholar
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-stretch w-9/12 ml-24 max-md:w-full max-md:ml-0">
                    <div className="text-stone-900 text-lg font-medium leading-[177.778%] w-[848px] max-w-full max-md:mt-10">
                      Dr. Germán A. Cadenas (he/his/el) is an Assistant Professor
                      of Counseling Psychology at Lehigh University. He is a
                      formerly undocumented immigrant from Latin America. As a
                      scholar-activist, he has been involved in the movement for
                      immigrant rights for over a decade. He completed a PhD in
                      Counseling Psychology at Arizona State University, and a
                      Doctoral Internship and Postdoctoral Fellowship at the
                      University of California Berkeley.
                      <br />
                      <br />
                      His academic work is community-based and focuses on the
                      psychology of immigration and on critical consciousness as a
                      tool for social justice. He particularly examines the impact
                      of immigration policy on the psychological wellbeing,
                      education, career/work, and health of Latinx immigrants. His
                      work also includes the development and validation of
                      strategies for mental health service providers and educators
                      working with immigrants. His work has been externally funded
                      and published widely. He serves as Associate Editor of
                      Journal of Counseling Psychology, and is on the Editorial
                      Boards of Journal of Diversity in Higher Education and
                      Journal of Career Development.
                      <br />
                      <br />
                      Dr. Cadenas has informed policy and advocacy at the local,
                      state, and national levels. This includes advocacy for
                      higher education access of undocumented students, grassroots
                      advocacy for humane federal immigration policies, and
                      briefing Congress on research conducted with the National
                      Latinx Psychological Association (NLPA) regarding COVID-19
                      among Latinxs. He serves on the APA Advocacy Coordinating
                      Committee and as Vice President for Diversity and Public
                      Interest in the Society of Counseling Psychology (Divisions
                      17 of APA). He also co-led the Interdivisional Immigration
                      Project that developed collaborative advocacy strategies for
                      community activists and psychologists.
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-orange-300 w-[1247px] h-1 mt-10 max-md:max-w-full" />
              <div className="self-center flex w-full max-w-[1246px] flex-col mt-16 max-md:max-w-full">
                <div className="self-center w-full max-md:max-w-full">
                  <div className="flex flex-wrap max-md:flex-col max-md:items-stretch max-md:gap-0">
                    {data["team"]["stakeholders_two"].map((item, index) => (
                      <div key={index} className="flex flex-col items-stretch w-1/4 p-[25px] mb-[70px] max-md:w-full max-md:ml-0">
                        <div className="flex flex-col items-stretch w-full max-md:w-full max-md:ml-0">
                          <div className="flex flex-col items-stretch mb-[30px] max-md:w-full max-md:ml-0" style={{ paddingRight: "100px" }}>
                            <img
                              loading="lazy"
                              srcSet={item.image}
                              className="aspect-[0.98] object-cover rounded-full object-center w-full overflow-hidden grow max-md:mt-10 border-4 border-solid border-lightsalmon shadow-[2px_4px_0px_0px_darkorchid]"
                            />
                          </div>
                          <div className="flex grow flex-col max-md:mt-10">
                            <div className="text-stone-900 text-2xl font-bold leading-[133.333%]">
                              {item.name}
                            </div>
                            <div className="text-stone-900 text-lg font-medium leading-[177.778%] mt-1">
                              {item.title}
                            </div>
                            <div className="text-stone-900 text-lg font-medium leading-[177.778%] mt-6">
                              {item.text}
                            </div>
                            <a href={item.link} className="text-purple-700 text-xs font-bold tracking-wide uppercase mt-9">
                              Read More
                            </a>
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
        <div className="bg-amber-100 self-stretch flex mt-0 w-full flex-col pb-20 px-5 max-md:max-w-full">
          <div className="self-center flex w-full max-w-[1246px] flex-col mt-0.5 max-md:max-w-full" style={{ marginTop: "-110px" }}>
            <div className="self-center w-full max-md:max-w-full">
              <div className="flex flex-wrap max-md:flex-col max-md:items-stretch max-md:gap-0">
                {data["team"]["technical"].map((item, index) => (
                  <div key={index} className="flex flex-col items-stretch w-1/4 p-[25px] mb-[70px] max-md:w-full max-md:ml-0">
                    <div className="flex flex-col items-stretch w-full max-md:w-full max-md:ml-0">
                      <div className="flex flex-col items-stretch mb-[30px] max-md:w-full max-md:ml-0" style={{ paddingRight: "100px" }}>
                        <img
                          loading="lazy"
                          srcSet={item.image}
                          className="aspect-[0.98] object-cover rounded-full object-center w-full overflow-hidden grow max-md:mt-10 border-4 border-solid border-lightsalmon shadow-[2px_4px_0px_0px_darkorchid]"
                        />
                      </div>
                      <div className="flex grow flex-col max-md:mt-10">
                        <div className="text-stone-900 text-2xl font-bold leading-[133.333%]">
                          {item.name}
                        </div>
                        <div className="text-stone-900 text-lg font-medium leading-[177.778%] mt-1">
                          {item.title}
                        </div>
                        <div className="text-stone-900 text-lg font-medium leading-[177.778%] mt-6">
                          {item.text}
                        </div>
                        <a href={item.link} className="text-purple-700 text-xs font-bold tracking-wide uppercase mt-9">
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

export default Advisory;