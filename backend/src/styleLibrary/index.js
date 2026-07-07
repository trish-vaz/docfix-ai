const collegeAssignmentStyle = require("./collegeAssignment");
const businessReportStyle = require("./businessReport");
const resumeStyle = require("./resume");

const styleLibrary = {
    college_assignment: collegeAssignmentStyle,
    business_report: businessReportStyle,
    resume: resumeStyle,
};

function getStyleById(styleId) {
    return styleLibrary[styleId] || collegeAssignmentStyle;
}

module.exports = {
    styleLibrary,
    getStyleById,
};