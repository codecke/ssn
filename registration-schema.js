/* Shared questionnaire definitions for browser rendering and server validation. */
(() => {
  const forms = {
    volunteer: [
      { title: "Personal details", fields: [
        {"name":"fullName","label":"Full Name","type":"text","required":true},
        {"name":"gender","label":"Gender","type":"select","required":true,"options":["Male","Female"]},
        {"name":"country","label":"Country of Residence","type":"text","required":true},
        {"name":"state","label":"State of Residence","type":"text","required":true},
        {"name":"localGovernmentArea","label":"Local government area","type":"text","required":true},
        {"name":"whatsapp","label":"WhatsApp number","type":"tel","required":true},
        {"name":"email","label":"Email Address","type":"email","required":true},
      ] },
      { title: "Education and professional background", fields: [
        {"name":"profession","label":"Which category best describes you?","type":"select","required":true,"options":["Medical Doctor","Dentist","Nurse / Midwife","Pharmacist","Medical Laboratory Scientist","Radiographer / Radiologist","Public Health Professional","Allied Health Professional","Researcher / Academic","University Student","Other Student","Non-healthcare Professional","Community Volunteer","Other"]},
        {"name":"student","label":"Are you currently a student?","type":"select","required":true,"options":["Yes","No"]},
        {"name":"studentDetails","label":"If YES, indicate; Course of Study, Institution / University, Current Level of Study","type":"text","required":false,"when":["student",["Yes"]]},
        {"name":"specialisation","label":"If you are a healthcare professional, what is your area of specialisation or professional cadre?","type":"text","required":false},
      ] },
      { title: "Volunteering interests", fields: [
        {"name":"interestAreas","label":"How would you like to contribute? Select all that apply.","type":"multi","required":true,"options":["Cancer screening and clinical assessment","Patient education and counselling","Nursing and clinical support","Medical consultations and referrals","Laboratory and diagnostic support","Patient navigation and follow-up","Public health research and documentation","Data collection and management","Monitoring and evaluation","Community mobilisation and sensitisation","Advocacy and awareness campaigns","School and university outreach","Community health education","Local coordination and field support","Graphic design","Photography and videography","Social media management","Content creation and copywriting","Public relations and communications","Video editing and production"]},
      ] },
      { title: "Leadership and coordination", fields: [
        {"name":"leadershipInterest","label":"Would you be interested in taking up a volunteer leadership coordination role?","type":"select","required":true,"options":["Yes","No","Maybe, depending on the responsibilities."]},
        {"name":"leadershipRole","label":"Which leadership role would you be interested in?","type":"select","required":true,"options":["State Volunteer Coordinator","Local Government / Community Volunteer Coordinator","Volunteer Team Lead","Other","None"],"when":["leadershipInterest",["Yes","Maybe, depending on the responsibilities."]]},
        {"name":"coordinationStates","label":"Which state would you be interested in coordinating?","type":"multi","required":true,"options":["Abia (Capital: Umuahia)","Adamawa (Capital: Yola)","Akwa Ibom (Capital: Uyo)","Anambra (Capital: Awka)","Bauchi (Capital: Bauchi)","Bayelsa (Capital: Yenagoa)","Benue (Capital: Makurdi)","Borno (Capital: Maiduguri)","Cross River (Capital: Calabar)","Delta (Capital: Asaba)","Ebonyi (Capital: Abakaliki)","Edo (Capital: Benin City)","Ekiti (Capital: Ado-Ekiti)","Enugu (Capital: Enugu)","Gombe (Capital: Gombe)","Imo (Capital: Owerri)","Jigawa (Capital: Dutse)","Kaduna (Capital: Kaduna)","Kano (Capital: Kano)","Katsina (Capital: Katsina)","Kebbi (Capital: Birnin Kebbi)","Kogi (Capital: Lokoja)","Kwara (Capital: Ilorin)","Lagos (Capital: Ikeja)","Nasarawa (Capital: Lafia)","Niger (Capital: Minna)","Ogun (Capital: Abeokuta)","Ondo (Capital: Akure)","Osun (Capital: Osogbo)","Oyo (Capital: Ibadan)","Plateau (Capital: Jos)","Rivers (Capital: Port Harcourt)","Sokoto (Capital: Sokoto)","Taraba (Capital: Jalingo)","Yobe (Capital: Damaturu)","Zamfara (Capital: Gusau)","Federal Capital Territory"],"when":["leadershipRole",["State Volunteer Coordinator","Local Government / Community Volunteer Coordinator","Volunteer Team Lead","Other"]]},
        {"name":"basedInState","label":"Are you currently based in this state?","type":"select","required":true,"options":["Yes","No"],"when":["leadershipRole",["State Volunteer Coordinator","Local Government / Community Volunteer Coordinator","Volunteer Team Lead","Other"]]},
        {"name":"leadershipExperience","label":"Have you previously held a leadership, coordination or community mobilisation position?","type":"select","required":true,"options":["Yes","No"],"when":["leadershipInterest",["Yes","Maybe, depending on the responsibilities."]]},
        {"name":"leadershipDetails","label":"Briefly describe your leadership experience","type":"textarea","required":false,"when":["leadershipExperience",["Yes"]]},
        {"name":"coordinatorMotivation","label":"Why would you be interested in becoming a STAY SAFE NIGERIA State Coordinator?","type":"textarea","required":false,"when":["leadershipRole",["State Volunteer Coordinator","Local Government / Community Volunteer Coordinator","Volunteer Team Lead","Other"]]},
        {"name":"coordinatorSkills","label":"What relevant experience, skills or networks would you bring to this role?","type":"textarea","required":false,"when":["leadershipRole",["State Volunteer Coordinator","Local Government / Community Volunteer Coordinator","Volunteer Team Lead","Other"]]},
      ] },
      { title: "Availability and deployment", fields: [
        {"name":"volunteerMode","label":"How would you prefer to volunteer?","type":"select","required":true,"options":["On-site / Physical participation","Remote / Virtual participation","Both on-site and remote"]},
        {"name":"preferredLocation","label":"Which geographical location would you prefer to volunteer in?","type":"select","required":true,"options":["My state of residence","Any state within Nigeria","FCT Abuja","Multiple states"]},
        {"name":"availability","label":"How much time can you commit?","type":"select","required":true,"options":["One-time participation","Weekends","A few hours weekly","Several days weekly","Flexible availability"]},
        {"name":"previousVolunteering","label":"Do you have previous volunteering or community service experience?","type":"select","required":true,"options":["No","Yes"]},
        {"name":"volunteeringDetails","label":"Briefly describe your volunteering experience","type":"textarea","required":true,"when":["previousVolunteering",["Yes"]]},
        {"name":"motivation","label":"Why would you like to volunteer with STAY SAFE NIGERIA?","type":"textarea","required":true},
      ] },
      { title: "Declaration", fields: [
        {"name":"accuracy","label":"Accuracy of information","type":"check","required":true,"options":["I confirm that the information provided is accurate"]},
        {"name":"contactConsent","label":"Permission to contact you","type":"check","required":true,"options":["I consent to being contacted by the STAY SAFE NIGERIA programme team regarding volunteer registration, deployment, training and programme activities."]},
      ] },
    ],
    partner: [
      { title: "Organisation details", fields: [
        {"name":"organisation","label":"Name of Organisation / Institution","type":"text","required":true},
        {"name":"organisationType","label":"Type of Organisation","type":"select","required":true,"options":["Hospital / Healthcare Institution","Teaching Hospital / Medical Centre","Cancer Centre / Oncology Centre","Specialist Clinic / Diagnostic Centre","Medical or Professional Association","Government Agency / Ministry","Non-Governmental Organisation (NGO)","University / Educational Institution","Corporate Organisation","Research Institution","Foundation / Philanthropic Organisation","Media Organisation","Other"]},
        {"name":"otherOrganisationType","label":"Other organisation type","type":"text","required":true,"when":["organisationType",["Other"]]},
        {"name":"country","label":"Country","type":"text","required":true},
        {"name":"state","label":"State","type":"text","required":true},
        {"name":"website","label":"Organisation’s Website (if available)","type":"url","required":false},
        {"name":"officialEmail","label":"Official Email Address","type":"email","required":true},
        {"name":"organisationPhone","label":"Contact Phone Number","type":"tel","required":true},
      ] },
      { title: "Contact person", fields: [
        {"name":"fullName","label":"Full Name","type":"text","required":true},
        {"name":"position","label":"Designation / Position","type":"text","required":true},
        {"name":"email","label":"Email Address","type":"email","required":true},
        {"name":"whatsapp","label":"WhatsApp number","type":"tel","required":true},
      ] },
      { title: "Partnership proposal", fields: [
        {"name":"partnershipAreas","label":"How would your organisation like to partner with STAY SAFE NIGERIA? Select all applicable areas.","type":"multi","required":false,"options":["Provision of screening facilities and clinical services.","Medical personnel and healthcare professionals.","Diagnostic equipment and medical supplies.","Community outreach and mobilisation.","State or regional programme coordination.","Public education and awareness.","Research, data and monitoring.","Media and communications.","Financial sponsorship and funding.","Technical expertise and advisory support.","Logistics and operational support.","Institutional endorsement.","Other (please specify)."]},
        {"name":"otherPartnershipArea","label":"Other partnership area","type":"text","required":true,"when":["partnershipAreas",["Other (please specify)."]]},
        {"name":"resources","label":"What resources, expertise or support can your organisation contribute?","type":"textarea","required":false},
        {"name":"coverage","label":"Which geographical area(s) would your organisation be interested in supporting?","type":"select","required":false,"options":["National coverage","Specific states (please specify)","Specific communities / LGAs"]},
        {"name":"coverageDetails","label":"States, communities or local government areas","type":"text","required":true,"when":["coverage",["Specific states (please specify)","Specific communities / LGAs"]]},
        {"name":"proposal","label":"Tell us briefly about your proposed partnership or how you envision working with us.","type":"textarea","required":false},
        {"name":"contactConsent","label":"Permission to contact you","type":"check","required":true,"options":["I agree to be contacted by Blue Ozone Health about this partnership enquiry."]},
      ] },
    ],
  };
  const fields = (type) => Object.hasOwn(forms, type) ? forms[type].flatMap((group) => group.fields) : [];
  const isVisible = (field, answers) => {
    if (!field.when) return true;
    const [name, options] = field.when;
    return [].concat(answers[name] ?? []).some((value) => options.includes(value));
  };
  const maxLength = (field) => field.type === "textarea" ? 2000 : 240;
  const schema = { forms, fields, isVisible, maxLength };
  if (typeof module === "object" && module.exports) module.exports = schema;
  else window.SSNRegistrationSchema = schema;
})();
