var fileData = [];
var gradeslist = [];

function init(){
  document.getElementById('file-input').addEventListener('change', handleFileSelect, false);
}

function handleFileSelect(event){
  const reader = new FileReader()
  reader.onload = handleFileLoad;
  reader.readAsText(event.target.files[0])
}

function handleFileLoad(event) {
    console.log(event);
    // file data
    fileData = event.target.result.split(/\s*(?:,|\r\n)\s*/); // regexp
    gradeslist = [];
    // array of numbers
    for (let i = 0; i < Math.ceil((fileData.length-3)/2); i++){
      gradeslist.push(fileData[2*i+3]);
    }
  
    // sort in ascending order
    gradeslist.sort(function(a, b){return a - b});
    let grade_length = gradeslist.length;
  
    updatePage(fileData,gradeslist,grade_length)

}

function updatePage(file,grades,length){
  // assign default values if none given
  if (file === undefined) {
    file = fileData;
  }
  if (grades === undefined) {
    grades = gradeslist;
  }
  if (length === undefined) {
    length = grades.length;
  }

  // clear histogram just in case
  document.getElementById("a+-graph").textContent = "";
  document.getElementById("a-graph").textContent = "";
  document.getElementById("a--graph").textContent = "";
  document.getElementById("b+-graph").textContent = "";
  document.getElementById("b-graph").textContent = "";
  document.getElementById("b--graph").textContent = "";
  document.getElementById("c+-graph").textContent = "";
  document.getElementById("c-graph").textContent = "";
  document.getElementById("c--graph").textContent = "";
  document.getElementById("d-graph").textContent = "";
  document.getElementById("f-graph").textContent = "";

  // clear stats just in case
  document.getElementById("highest").textContent = "";
  document.getElementById("lowest").textContent = "";
  document.getElementById("mean").textContent = "";
  document.getElementById("median").textContent = "";

  // VALIDATION
  // if file empty
  if(file.length <= 0){ 
    return;
  }
  if(length <= 0){
    return;
  }
  // get bounds
  let maxbound = document.getElementById("max-bound").value;
  let bound_ap = document.getElementById("a+-bound").value;
  let bound_a = document.getElementById("a-bound").value;
  let bound_am = document.getElementById("a--bound").value;
  let bound_bp = document.getElementById("b+-bound").value;
  let bound_b = document.getElementById("b-bound").value;
  let bound_bm = document.getElementById("b--bound").value;
  let bound_cp = document.getElementById("c+-bound").value;
  let bound_c = document.getElementById("c-bound").value;
  let bound_cm = document.getElementById("c--bound").value;
  let bound_d = document.getElementById("d-bound").value;
  let minbound = document.getElementById("f-bound").value;

  //check if bounds are valid (no overlap)
  const boundcheck = [minbound, bound_d, bound_cm, bound_c, bound_cp, bound_bm, bound_b, bound_bp, bound_am, bound_a, bound_ap, maxbound]
  const result = boundcheck.toSorted(function(a, b){return a - b});
  for(let i = 0; i<result.length; i++){
    if(result[i] != boundcheck[i]){
      alert("Error with lower bounds. Please make sure bound values do not overlap.");
      return;
    } 
    if(Number(result[i])== Number(result[i+1])){
      alert("Error with lower bounds. Please make sure all bounds are distinct.")
      return;
    }
  }

  // CHECK IF DATA WITHIN MIN/MAX BOUNDS, GET RID OF ANY THAT ISNT
  grades = checkMaxBound(maxbound,grades,length); //MAX
  length = grades.length; // recalculate length
  grades = checkMinBound(minbound, grades,length); //MIN
  length = grades.length; // recalculate length
  // end VALIDATION


  // FIND STATS (BASED ON BOUNDS)
  const median = findMedian(grades,length); //MEDIAN
  const mean = findMean(grades,length); // MEAN
  const highest = findLargest(grades,length); //MAX
  let highStudent = file[file.indexOf(highest) - 1]; // corresponding student
  const lowest = findSmallest(grades); //MIN
  let lowStudent = file[file.indexOf(lowest) - 1] // corresponding student
  // DISPLAY STATS
  document.getElementById("highest").textContent = highStudent + " (" + highest + "%)";
  document.getElementById("lowest").textContent = lowStudent + " (" + lowest + "%)";
  document.getElementById("mean").textContent = mean + "%";
  document.getElementById("median").textContent = median + "%";

  // HISTOGRAM
  // adding to graph
  for (let i in grades){
    if(Number(grades[i]) < bound_d ){ // f grades 
      drawGraph("f-graph")
    } else if(Number(grades[i]) < bound_cm) { // d grades
      drawGraph("d-graph")
    } else if(Number(grades[i]) < bound_c) {
      drawGraph("c--graph")
    } else if(Number(grades[i]) < bound_cp) {
      drawGraph("c-graph")
    }else if(Number(grades[i]) < bound_bm) {
      drawGraph("c+-graph")
    }else if(Number(grades[i]) < bound_b) {
      drawGraph("b--graph")
    }else if(Number(grades[i]) < bound_bp) {
      drawGraph("b-graph")
    }else if(Number(grades[i]) < bound_am) {
      drawGraph("b+-graph")
    }else if(Number(grades[i]) < bound_a) {
      drawGraph("a--graph")
    } else if(Number(grades[i]) < bound_ap) {
      drawGraph("a-graph")
    } else { 
      drawGraph("a+-graph")
    }
  }

}

function drawGraph(idname){
  let x = String.fromCodePoint(128213);
  let text = document.getElementById(idname).textContent 
  text = text + x; 
  document.getElementById(idname).textContent = text;
} 

// TAKES SORTED ARRAY (ascending order)
function checkMaxBound(maxbound, array, length){
  if((array[length-1] - maxbound) >0){
    alert("Some grades in the file exceed the maximum bound. They will not be used in the calculation.");
    // remove numbers from list:
    let i = length-1;
    while(((array[i] - maxbound) > 0) && i >=0){
      i--;
    }
    return array.slice(0,i);
  }
  return array;
}

// TAKES SORTED ARRAY (ascending order)
function checkMinBound(minbound, array, length){
  if((array[0] - minbound) < 0){
    alert("Some grades in the file fall below the minimum bound. They will not be used in the calculation.");
    // remove numbers from list:
    let i = 0;
    while( ((array[i] - minbound) < 0) && i < length){
      i++;
    }
    return array.slice(i, length);
  }
  return array;
}

// TAKES SORTED ARRAY (ascending order)
function findMedian(array,length){
  let median = 0;
  
  if(length % 2 == 0) { // if even 
    const middle = length/2;
    median = (Number(array[middle]) + Number(array[middle-1])) /2;
  } else { // if odd
    const middle = (length +1)/2;
    median = Number(array[middle-1]);
  }
  median = median.toFixed(2);
  return median;
}

function findMean(array,length){
  let sum = 0;
  for (let i in array){
    sum = sum + Number(array[i]);
  }
  sum = sum/length;
  sum = sum.toFixed(2);
  return sum;
}

// TAKES SORTED ARRAY (ascending order)
function findLargest(array,length){
  return array[length-1];
}

// TAKES SORTED ARRAY (ascending order)
function findSmallest(array){
  return array[0];
}

