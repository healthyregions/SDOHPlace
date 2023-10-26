import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  color: "white",
  bgcolor: "#1e1e1e",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function TopLines() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="bg-orange-300 max-w-[1068px] h-1 mt-10 max-md:max-w-full max-h-full" />
          <div className="self-center w-full mt-10 max-md:max-w-full">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              <div className="flex flex-col items-stretch w-3/12 max-md:w-full max-md:ml-0">
                <div className="flex flex-col max-md:mt-10">
                  <img
                    loading="lazy"
                    srcSet="../../images/a21bdb2d31a8ee99bfbec48165ca6a41.png"
                    className="aspect-[0.94] object-cover object-center w-full overflow-hidden"
                  />
                  <div className="text-2xl font-bold leading-[133.333%] mt-6">
                    German Cadenas
                  </div>
                  <div className="text-lg font-medium leading-[177.778%] mt-2.5">
                    Rutgers University
                  </div>
                  <div className="text-lg font-medium leading-[177.778%] mt-11 max-md:mt-10">
                    LinkedIn
                  </div>
                  <div className="text-lg font-medium leading-[177.778%] mt-3">
                    Google Scholar
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-stretch w-9/12 ml-24 max-md:w-full max-md:ml-0">
                <div className="text-lg font-medium leading-[177.778%] w-[848px] max-w-full max-md:mt-10">
                  Dr. Germán A. Cadenas (he/his/el) is an Assistant Professor of
                  Counseling Psychology at Lehigh University. He is a formerly
                  undocumented immigrant from Latin America. As a
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
                  and published widely. He serves as Associate Editor of Journal
                  of Counseling Psychology, and is on the Editorial Boards of
                  Journal of Diversity in Higher Education and Journal of Career
                  Development.
                  <br />
                  <br />
                  Dr. Cadenas has informed policy and advocacy at the local,
                  state, and national levels. This includes advocacy for higher
                  education access of undocumented students, grassroots advocacy
                  for humane federal immigration policies, and briefing Congress
                  on research conducted with the National Latinx Psychological
                  Association (NLPA) regarding COVID-19 among Latinxs. He serves
                  on the APA Advocacy Coordinating Committee and as Vice
                  President for Diversity and Public Interest in the Society of
                  Counseling Psychology (Divisions 17 of APA). He also co-led
                  the Interdivisional Immigration Project that developed
                  collaborative advocacy strategies for community activists and
                  psychologists.
                </div>
              </div>
            </div>
          </div>
          <div className="bg-orange-300 w-[1247px] h-1 mt-10 max-md:max-w-full" />
        </Box>
      </Modal>
    </>
  );
}
