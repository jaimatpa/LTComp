// Data
var data = [];

// Data ix and key (we dropped the keys to reduce data size and save network cost)
// 0="id"
// 1="title"
// 2="voteCount",
// 3="viewCount"
// 4="date"
// 5="company"
// 6="role"
// 7="yoe"
// 8="salary"
// 9="city"
// 10="country"
// 11="cleanYoe"
// 12="cleanSalary"
// 13="yrOrPm"
// 14="cleanCompany"

// Constants
var pageSize = 25;
var nPages = Math.ceil(data.length / pageSize);

function setFullTimeOrInternship(yrOrPm) {
    window.data = [];
    for (i = 0; i < allData.length; i++) {
        if (allData[i][13] == yrOrPm) {
            window.data.push(allData[i]);
        }
    }
}
setFullTimeOrInternship("yearly");

function updatePageCount() {
    window.nPages = Math.ceil(data.length / pageSize);
}

// Reference to the table with posts info
var tableTbodyRef = document.getElementById("postInfo").getElementsByTagName("tbody")[0];

function getAllBaseSalaries() {
    var salaries = [];
    for (i = 0; i < data.length; i++) {
        salaries.push(data[i][12] / 100000)
    }
    return salaries;
}

function plotSalaryBarChartData() {
    salaries = getAllBaseSalaries();
    var trace = {
        x: salaries,
        type: "histogram",
        opacity: 0.5,
        marker: { color: "green" }
    };
    var layout = {
        title: { text: "# salaries #", font: { size: 12 } },
        height: 400,
        margin: { t: 20, l: 0, r: 0 },
        yaxis: { automargin: true },
        xaxis: { tickprefix: "₹ ", ticksuffix: " lpa" }
    };
    var salaryBarChart = [trace];
    Plotly.newPlot("salaryBarChart", salaryBarChart, layout);
}
plotSalaryBarChartData();

function plotTopCompaniesChartData() {
    var companies = [];
    var counts = [];
    for (i = 0; i < metaInfo["top20Companies"].length; i++) {
        companies.push(metaInfo["top20Companies"][i][0])
        counts.push(metaInfo["top20Companies"][i][1])
    }
    var data = [{
        type: "bar",
        x: companies,
        y: counts,
        orientation: "v",
        opacity: 0.5,
        marker: { color: "green" }
    }];
    var layout = {
        title: { text: "# top companies (static) #", font: { size: 12 } },
        margin: { t: 20, l: 25 },
        xaxis: { tickfont: { size: 10 } },
        showlegend: false
    }
    Plotly.newPlot("topCompaniesBarChart", data, layout);
}
plotTopCompaniesChartData();

function plotSalaryYoeBinsChart() {
    var yoeBin1 = []; var yoeBin2 = []; var yoeBin3 = []; var yoeBin4 = []; var yoeBin5 = [];
    for (i = 0; i < data.length; i++) {
        if (data[i][11] >= 0 && data[i][11] < 1) {
            yoeBin1.push(data[i][12]);
        }
        else if (data[i][11] >= 1 && data[i][11] < 3) {
            yoeBin2.push(data[i][12]);
        }
        else if (data[i][11] >= 3 && data[i][11] < 6) {
            yoeBin3.push(data[i][12]);
        }
        else if (data[i][11] >= 6 && data[i][11] < 9) {
            yoeBin4.push(data[i][12]);
        }
        else if (data[i][11] >= 9) {
            yoeBin5.push(data[i][12]);
        }
    }
    var trace1 = {
        y: yoeBin1,
        type: "box",
        name: "0-1",
        opacity: 0.5,
        marker: { color: "green" }
    };
    var trace2 = {
        y: yoeBin2,
        type: "box",
        name: "1-3",
        opacity: 0.5,
        marker: { color: "green" }
    };
    var trace3 = {
        y: yoeBin3,
        type: "box",
        name: "3-6",
        opacity: 0.5,
        marker: { color: "green" }
    };
    var trace4 = {
        y: yoeBin4,
        type: "box",
        name: "6-9",
        opacity: 0.5,
        marker: { color: "green" }
    };
    var trace5 = {
        y: yoeBin5,
        type: "box",
        name: "9+",
        opacity: 0.5,
        marker: { color: "green" }
    };
    var layout = {
        title: { text: "# yoe bins #", font: { size: 12 } }, margin: { t: 20, l: 30 },
        xaxis: { tickfont: { size: 10 } },
        showlegend: false
    }

    var traces = [trace1, trace2, trace3, trace4, trace5];
    Plotly.newPlot("salaryYoeBinsChart", traces, layout);
}
plotSalaryYoeBinsChart();

function getFormattedYoe(yoe) {
    if (yoe == -1) {
        return "<button class='btn-danger'>n/a</button>";
    }
    else {
        return yoe;
    }
}

// Add rows to the postInfo table
function updatePostsTableContent(startIndex, endIndex) {
    var myHtmlContent = "";
    endIndex = Math.min(data.length, endIndex)
    for (var i = startIndex; i < endIndex; i++) {
        myHtmlContent += "<tr><td>" + data[i][5] + "</td>";
        myHtmlContent += "<td>" + data[i][6].toLowerCase() + "</td>";
        myHtmlContent += "<td>" + getFormattedYoe(data[i][11]) + "</td>";
        myHtmlContent += "<td>₹ " + data[i][12].toLocaleString("en-IN") + "</td>";
        myHtmlContent += "<td>" + data[i][4] + "</td>";
        myHtmlContent += "<td>" + data[i][3] + "</td>";
        myHtmlContent += "<td>" + data[i][2] + "</td>";
        myHtmlContent += "<td>" + data[i][0] + "</td></tr>";
    }
    tableTbodyRef.innerHTML = myHtmlContent;
};
updatePostsTableContent(0, pageSize);

// Nav pagniation filter
function filterNavData(e) {
    pageNo = parseInt(e.text);
    startIndex = (pageNo - 1) * pageSize;
    endIndex = startIndex + pageSize;
    updatePostsTableContent(startIndex, endIndex);
};

// Increment Nav page numbers
function incrementNavPageNo() {
    if (parseInt(document.getElementById("navPageNo3").text) == nPages) {
        return;
    }
    document.getElementById("navPageNo1").text = parseInt(document.getElementById("navPageNo1").text) + 1;
    document.getElementById("navPageNo2").text = parseInt(document.getElementById("navPageNo2").text) + 1;
    document.getElementById("navPageNo3").text = parseInt(document.getElementById("navPageNo3").text) + 1;
}

// Decrement Nav page numbers
function decrementNavPageNo() {
    if (parseInt(document.getElementById("navPageNo1").text) == 1) {
        return;
    }
    document.getElementById("navPageNo1").text = parseInt(document.getElementById("navPageNo1").text) - 1;
    document.getElementById("navPageNo2").text = parseInt(document.getElementById("navPageNo2").text) - 1;
    document.getElementById("navPageNo3").text = parseInt(document.getElementById("navPageNo3").text) - 1;
}

function resetNavPageNo() {
    document.getElementById("navPageNo1").text = 1;
    document.getElementById("navPageNo2").text = 2;
    document.getElementById("navPageNo3").text = 3;
}

function updateNRows() {
    document.getElementById("nRows").innerHTML = "# rows: " + data.length
}
updateNRows();

function resetData() {
    plotSalaryBarChartData();
    plotSalaryYoeBinsChart();
    updatePageCount();
    updatePostsTableContent(0, pageSize);
    resetNavPageNo();
    updateNRows();
}

// Toggle to Intern
function makeInternButton() {
    eInternship = document.getElementById("internshipButton");
    eFullTime = document.getElementById("fullTimeButton");
    eFullTime.classList.remove("active");
    eInternship.classList.add("active");

    setFullTimeOrInternship("monthly");
    resetData();
}

// Toggle to Full time
function makeFullTimeButton() {
    eInternship = document.getElementById("internshipButton");
    eFullTime = document.getElementById("fullTimeButton");
    eInternship.classList.remove("active");
    eFullTime.classList.add("active");

    setFullTimeOrInternship("yearly");
    resetData();
}

// Search
function filterSearchIndexes(ixs) {
    window.data = [];
    if (document.getElementById("fullTimeButton").classList.contains("active")) {
        for (i = 0; i < ixs.length; i++) {
            if (allData[ixs[i]][13] == "yearly") {
                window.data.push(allData[ixs[i]]);
            }
        }
    }
    else if (document.getElementById("internshipButton").classList.contains("active")) {
        for (i = 0; i < ixs.length; i++) {
            if (allData[ixs[i]][13] == "monthly") {
                window.data.push(allData[ixs[i]]);
            }
        }
    }
}

function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

function search(e) {
    var allIxs = [];
    if (e.value.length > 2) {
        txt = e.value.toLowerCase();
        txtSplits = txt.split(" ");
        for (i = 0; i < txtSplits.length; i++) {
            txtToSearch = txtSplits[i];
            if (txtToSearch in invertedIndex) {
                allIxs = allIxs.concat(invertedIndex[txtToSearch]);
            }
        }
        allIxs = [...new Set(allIxs)];
        allIxs.sort(function (a, b) {
            return a - b;
        });;
        filterSearchIndexes(allIxs);
        resetData();
    }
}
const searchText = debounce((e) => search(e));


// Min-Max Yoe
function _yoeFilter(e) {
    minYoe = document.getElementById("minYoe").value;
    maxYoe = document.getElementById("maxYoe").value;
    if (minYoe.length == 0) {
        minYoe = -0.99;
    }
    else {
        minYoe = parseFloat(minYoe)
    }
    if (maxYoe.length == 0) {
        maxYoe = 30.0;
    }
    else {
        maxYoe = parseFloat(maxYoe)
    }
    window.data = [];
    for (i = 0; i < allData.length; i++) {
        yoe = parseFloat(allData[i][11]);
        if (yoe >= minYoe && yoe <= maxYoe) {
            window.data.push(allData[i]);
        }
    }
    resetData();
}
const yoeFilter = debounce((e) => _yoeFilter(e));

// Most offers
document.getElementById("mostOffers").innerHTML = ""
for (i = 0; i < metaInfo["mostOffersInLastMonth"].length; i++) {
    cc = metaInfo["mostOffersInLastMonth"][i]
    document.getElementById("mostOffers").innerHTML += "<div class='col'>"
        + cc[0] + "(" + cc[1] + ")" + "</div>"
}

// Stats
document.getElementById("stats").innerHTML = "Total Posts: " + metaInfo["totalPosts"]
    + " | Posts from India: " + metaInfo["totalPostsFromIndia"]
    + " | Last updated: " + metaInfo["lastUpdated"]


// Sorting by salary
var sortedAsc = false;

function compareObjectsAsc(object1, object2, key) {
    const obj1 = object1[key];
    const obj2 = object2[key];
    if (obj1 < obj2) {
        return -1;
    }
    if (obj1 > obj2) {
        return 1;
    }
    return 0
}

function compareObjectsDesc(object1, object2, key) {
    const obj1 = object1[key];
    const obj2 = object2[key];
    if (obj1 > obj2) {
        return -1;
    }
    if (obj1 < obj2) {
        return 1;
    }
    return 0
}

function sortBySalary(e) {
    if (sortedAsc == false) {
        data.sort((post1, post2) => {
            return compareObjectsAsc(post1, post2, e.id);
        });
        sortedAsc = true;
    }
    else {
        data.sort((post1, post2) => {
            return compareObjectsDesc(post1, post2, e.id);
        });
        sortedAsc = false;
    }
    resetData();
}
