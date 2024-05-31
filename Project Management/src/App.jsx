import Sidebar from "./components/Sidebar"
import NewProject from "./components/NewProject"
import NoProjectSelected from "./components/NoProjectSelected";
import { useState } from "react";
import SelectedProject from "./components/SelectedProject";
function App() {
  const [projectsState, setProjectsState] = useState({
    projectSelected: undefined,
    projects: [],
    tasks: []
  })

  function handleAddTask(text) {
    setProjectsState((prevState) => {
      const taskId = Math.random();
      const newTask = {
        text: text,
        projectId: prevState.selectedProjectId,
        id: taskId,
      };

      return {
        ...prevState,
        tasks: [newTask, ...prevState.tasks],
      };
    });
  }

  function handleDeleteTask(id) {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        tasks: prevState.tasks.filter((task) => task.id !== id),
      };
    });
  }

  function handleDeleteProject(){
    setProjectsState(prevState => {
      return {
        ...prevState,
        selectedProjectId: undefined,
        projects:prevState.projects.filter(project => project.id != prevState.selectedProjectId)
      };
    });
  }
  function handleSelectProject(id){
    setProjectsState(prevState => {
      return {
        ...prevState,
        selectedProjectId: id
      };
    });
  }
  function handleStartAddProject() {
    setProjectsState(prevState => {
      return {
        ...prevState,
        selectedProjectId: null,
      };
    });
  }

  function handleAddProject(ProjectData){
    setProjectsState(prevState => {
      const projectId = Math.random();
      const newProject = {
        ...ProjectData,
        id: projectId
      }
      return {
        ...prevState,
        selectedProjectId: undefined,
        projects:[...prevState.projects, newProject]
      };
    });
  }
  function handleCancelAddProject() {
    setProjectsState(prevState => {
      return {
        ...prevState,
        selectedProjectId: undefined,
      };
    });
  }
  const selectedProject = projectsState.projects.find((project) => project.id === projectsState.selectedProjectId);
  const selectedProjectTasks = projectsState.tasks.filter((task) => task.projectId === projectsState.selectedProjectId);
  let content = 
    (
    <SelectedProject 
      project = {selectedProject} 
      onDeleteProject={handleDeleteProject} 
      onAddTask={handleAddTask} 
      onDeleteTask={handleDeleteTask}
      tasks = {selectedProjectTasks}/>

    );
  if (projectsState.selectedProjectId === null) {
    content = <NewProject onAdd={handleAddProject} onCancel={handleCancelAddProject} /> 
  } else if (projectsState.selectedProjectId === undefined) {
    content = <NoProjectSelected onStartAddProject={handleStartAddProject} />;
  }

  return (

      <main className="h-screen my-8 flex gap-8">
        <Sidebar onStartAddProject={handleStartAddProject} onSelectProject={handleSelectProject}  projects={projectsState.projects}/>
        {content}
      </main>

  );
}

export default App;
