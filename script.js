const NUM_PAGES_PER_TREE = 8333;
// https://www.paperandwood.com/en/newsitem/?nid,2657/8333-sheets-of-paper-is-produced-from-each-tree.html

async function loadData() {
    const response = await fetch("data.json");
    return response.json();
}

function calculateTreesCut(numStudents, avgReports, avgPages) {
    return (numStudents * avgReports * avgPages) / NUM_PAGES_PER_TREE;
}

function renderHomePage(data) {
    let totalTrees = 0;
    let deptBreakdown = "<ul>";

    for (const dept in data) {
        let deptTrees = 0;
        for (const sem in data[dept]) {
            data[dept][sem].subjects.forEach(subject => {
                deptTrees += calculateTreesCut(
                    subject.num_students,
                    subject.avg_reports_per_student,
                    subject.avg_pages_per_report
                );
            });
        }
        totalTrees += deptTrees;
        deptBreakdown += `<li><a href="#/${dept}">${dept.toUpperCase()}</a>: ${deptTrees.toFixed(2)} trees cut</li>`;
    }
    deptBreakdown += "</ul>";

    document.getElementById("content").innerHTML = `
        <p>On average, ${NUM_PAGES_PER_TREE} A4 sheets can be produced from a single tree.</p>
        <p><strong>How many trees has your college contributed to cutting?</strong></p>
        <p><strong>Total Trees Cut:</strong> ${totalTrees.toFixed(2)}</p>
        <h2>Breakdown by Department</h2>
        ${deptBreakdown}
    `;
}

function renderDepartmentPage(data, dept) {
    let deptTrees = 0;
    let semBreakdown = "<ul>";

    for (const sem in data[dept]) {
        let semTrees = 0;
        data[dept][sem].subjects.forEach(subject => {
            semTrees += calculateTreesCut(
                subject.num_students,
                subject.avg_reports_per_student,
                subject.avg_pages_per_report
            );
        });
        deptTrees += semTrees;
        semBreakdown += `<li><a href="#/${dept}/${sem}">Semester ${sem}</a>: ${semTrees.toFixed(2)} trees cut</li><br>`;
    }
    semBreakdown += "</ul>";

    document.getElementById("content").innerHTML = `
        
        <p><strong>Total Trees Cut in ${dept.toUpperCase()}:</strong> ${deptTrees.toFixed(2)}</p>
        <h2>Breakdown by Semester</h2>
        ${semBreakdown}
    `;
}

function renderSemesterPage(data, dept, sem) {
    let totalTrees = 0;
    let subjectBreakdown = "<ul>";

    data[dept][sem].subjects.forEach(subject => {
        const treesCut = calculateTreesCut(
            subject.num_students,
            subject.avg_reports_per_student,
            subject.avg_pages_per_report
        );
        totalTrees += treesCut;

        subjectBreakdown += `<li><strong>${subject.name}</strong><br>
            Students: ${subject.num_students}<br>
            Avg Reports/Student: ${subject.avg_reports_per_student}<br>
            Avg Pages/Report: ${subject.avg_pages_per_report}<br>
            Trees Cut: ${treesCut.toFixed(2)}<br><br></li>`;
    });
    subjectBreakdown += "</ul>";

    document.getElementById("content").innerHTML = `
        <h2>${dept.toUpperCase()} - Semester ${sem} Impact</h2>
        <p><strong>Total Trees Cut in Semester ${sem}:</strong> ${totalTrees.toFixed(2)}</p>
        <h2>Breakdown by Subject</h2>
        ${subjectBreakdown}
    `;
}

function router() {
    const hash = window.location.hash.slice(2);
    loadData().then(data => {
        if (!hash) {
            renderHomePage(data);
        } else {
            const parts = hash.split("/");
            const dept = parts[0];

            if (parts.length === 1 && data[dept]) {
                renderDepartmentPage(data, dept);
            } else if (parts.length === 2 && data[dept]?.[parts[1]]) {
                renderSemesterPage(data, dept, parts[1]);
            } else {
                document.getElementById("content").innerHTML = "<h2>Page Not Found</h2>";
            }
        }
    });
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);
