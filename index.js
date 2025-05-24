import { elements } from "./common/elements.js";
import { setSelectedElement } from "./src/mouseAndKeyHandler.js";

// Populate dropdown with element options
const dropdownContent = document.querySelector("#dropdown-content");
dropdownContent.innerHTML = ""; // Clear any placeholder

// Add Tools section
const toolsHeader = document.createElement("div");
toolsHeader.style.fontWeight = "bold";
toolsHeader.style.padding = "8px 16px 4px 16px";
toolsHeader.style.color = "#888";
toolsHeader.textContent = "Tools";
dropdownContent.appendChild(toolsHeader);

const heatTool = document.createElement("a");
heatTool.href = "#";
heatTool.textContent = "Heat";
heatTool.onclick = (e) => {
  e.preventDefault();
  setSelectedElement("heat");
  document.getElementById("dropbtn").textContent = "Heat";
};
dropdownContent.appendChild(heatTool);

const coolTool = document.createElement("a");
coolTool.href = "#";
coolTool.textContent = "Cool";
coolTool.onclick = (e) => {
  e.preventDefault();
  setSelectedElement("cool");
  document.getElementById("dropbtn").textContent = "Cool";
};
dropdownContent.appendChild(coolTool);

// Divider
const divider = document.createElement("div");
divider.style.borderTop = "1px solid #eee";
divider.style.margin = "4px 0";
dropdownContent.appendChild(divider);

// Add element options
Object.entries(elements).forEach(([key, element]) => {
  const a = document.createElement("a");
  a.href = "#";
  a.textContent = element.name;
  a.style.color = element.color;
  a.onclick = (e) => {
    e.preventDefault();
    setSelectedElement(key);
    document.getElementById("dropbtn").textContent = element.name;
  };
  dropdownContent.appendChild(a);
});

// Set default button text
document.getElementById("dropbtn").textContent = elements["powder"].name;
