const BLACKLISTED_KEY_CODES = [38];
const COMMANDS = {
  help:
    'Main commands:<div class="commands-row"><span class="cm-col-code">about</span><span class="cm-col-purpose">\
    Displays basic information about Benny.</span></div><div class="commands-row"><span class="cm-col-code">projects</span><span class="cm-col-purpose">\
    Displays Bennys Projects.</span></div><div class="commands-row"><span class="cm-col-code">\
    contact</span><span class="cm-col-purpose">Displays contact information for Benny.</span></div><div class="commands-row">\
    <span class="cm-col-code">education</span><span class="cm-col-purpose">Displays information about Benny\'s studies.</span>\
    </div><div class="commands-row"><span class="cm-col-code">experience</span><span class="cm-col-purpose">\
    Displays information about Benny\'s experience.</span></div><div class="commands-row"><span class="cm-col-code">\
    skills</span><span class="cm-col-purpose">Displays information about Benny\'s skills as a developer.</span></div>\
    <br>All commands:<div class="commands-row"><span class="cm-col-code">about</span><span class="cm-col-purpose">\
    Displays basic information about Benny.</span></div><div class="commands-row"><span class="cm-col-code">cls</span>\
    <span class="cm-col-purpose">Clears the screen.</span></div><div class="commands-row"><span class="cm-col-code">contact</span>\
    <span class="cm-col-purpose">Displays contact information for Benny.</span></div><div class="commands-row"><span class="cm-col-code">\
    date</span><span class="cm-col-purpose">Displays the current date.</span></div><div class="commands-row">\
    <span class="cm-col-code">education</span><span class="cm-col-purpose">Displays information about Benny\'s studies.</span>\
    </div><div class="commands-row"><span class="cm-col-code">experience</span><span class="cm-col-purpose">\
    Displays information about Benny\'s experience.</span></div><div class="commands-row">\
    <span class="cm-col-code">help</span><span class="cm-col-purpose">\
    Provides help information for this Terminal commands.</span></div>\
    <div class="commands-row"><span class="cm-col-code">skills</span><span class="cm-col-purpose">\
    Displays information about Benny\'s skills as a developer.</span></div><div class="commands-row">\
    <span class="cm-col-code">time</span><span class="cm-col-purpose">Displays the current time.</span></div>\
    <div class="commands-row"><span class="cm-col-code">projects</span><span class="cm-col-purpose">\
    Displays information about Benny\'s projects.</span></div>',
  about:
    "Hello <br>My name is Benny Nottonson. I’m a student currently living in California.\
     I love programming and developing, especially involving machine learning.",
  skills:
    '<span class="code">Languages:</span> HTML, CSS, JavaScript, TypeScript, Python \
    <br><span class="code">Libraries/Frameworks:</span> Numpy, Scikit, OpenCV, Express\
     <br><span class="code">Technologies:</span> Git\
     <br><span class="code">\
      Other:</span> Repl, Github',
  education:
    "Los Alamitos High School<br>California State University Long Beach — Computer Science<br>Minor in Statistics<br>Minor in Finance<br>",
  resume: "Not yet added", //"<a href='./resume.pdf' class='success link'>resume.pdf</a>",
  experience: "Developer, Freelance Work<br>In progress<br>",
  contact:
    "You can contact me at <a href='mailto:bnottonson@gmail.com' \
    class='success link'>bnottonson@gmail.com</a>",
  cls: '',
  date: `The current date is: ${new Date(Date.now()).toLocaleDateString()}`,
  time: `The current time is: ${new Date(Date.now()).toLocaleTimeString()}`,
  projects: "<a href='https://www.github.com/Benny-Nottonson' class='success link'>Github</a><br><a href='/spotifySort/index.html' class='success link'>Spotify Sort</a>"
};
let userInput, terminalOutput;

const app = () => {
  userInput = document.getElementById("userInput");
  terminalOutput = document.getElementById("terminalOutput");
  console.log("Application loaded");
};

const execute = function executeCommand(input) {
  let output;
  input = input.toLowerCase();
  if (input.length === 0) {
    return;
  }
  output = `<div class="terminal-line"><span class="success">➜</span> <span class="directory">~</span> ${input}</div>`;
  if (!COMMANDS.hasOwnProperty(input)) {
    output += `<div class="terminal-line">no such command: ${input}</div>`;
    console.log("Oops! no such command");
    console.log(input);
  } else if (input === "cls") {
    output = '';
    terminalOutput.innerHTML = '';
  } else {
    output += COMMANDS[input];
  }

  terminalOutput.innerHTML = `${terminalOutput.innerHTML}<div class="terminal-line">${output}</div>`;
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
};

const key = function keyEvent(e) {
  const input = userInput.innerHTML;

  if (BLACKLISTED_KEY_CODES.includes(e.keyCode)) {
    return;
  }

  if (e.key === "Enter") {
    execute(input);
    userInput.innerHTML = "";
    return;
  }

  userInput.innerHTML = input + e.key;
};

const backspace = function backSpaceKeyEvent(e) {
  if (e.keyCode !== 8 && e.keyCode !== 46) {
    return;
  }
  userInput.innerHTML = userInput.innerHTML.slice(
    0,
    userInput.innerHTML.length - 1
  );
};

document.addEventListener("keydown", backspace);
document.addEventListener("keypress", key);
document.addEventListener("DOMContentLoaded", app);
