import { useRef, useState } from 'react';
import Input from './Input.jsx';
import Modal from './modal.jsx';
export default function NewProject({onAdd, onCancel}) {
  const title = useRef();
  const description = useRef();
  const dueDate = useRef();
  const modal = useRef();
   
  function handleSubmit() {
    const titleValue = title.current.value;
    const descriptionValue = description.current.value;
    const dueDateValue = dueDate.current.value;
    const projectData = {
      title: titleValue,
      description: descriptionValue,
      dueDate: dueDateValue
    }
    if (titleValue===""|| descriptionValue==="" || dueDateValue===""){
      modal.current.open();
      return;
    }
    onAdd(projectData);

  }

  return (
    <>
      <Modal ref={modal} buttonCaption="Okay">
        <h2 className="text-xl font-bold text-stone-700 my-4">Invalid Input</h2>
        <p className="text-stone-600 mb-4">
          Oops ... looks like you forgot to enter a value.
        </p>
        <p className="text-stone-600 mb-4">
          Please make sure you provide a valid value for every input field.
        </p>        
      </Modal>
      <div className="w-[35rem] mt-16">
        <menu className="flex items-center justify-end gap-4 my-4">
          <li>
            <button onClick={onCancel} className="text-stone-800 hover:text-stone-950">Cancel</button>
          </li>
          <li>
            <button onClick={handleSubmit} className="px-6 py-2 rounded-md bg-stone-800 text-stone-50 hover:bg-stone-950">Save</button>
          </li>
        </menu>
        <div>
          <Input type="text" ref={title} label="Title"/>
          <Input ref={description} label="Description" textarea/>
          <Input type="date" ref={dueDate} label="Due Date" />
        </div>
      </div>
    </>
  );
}