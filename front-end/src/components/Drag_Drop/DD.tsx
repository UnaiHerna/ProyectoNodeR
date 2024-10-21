import React, { useState } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, RadioGroup, Radio } from "@nextui-org/react";

interface Task {
  id: string;
  content: string;
  status: 'pending' | 'in-progress' | 'completed';
}

const initialTasks: Task[] = [
  { id: '1', content: 'Tarea 1', status: 'pending' },
  { id: '2', content: 'Tarea 2', status: 'pending' },
  { id: '3', content: 'Tarea 3', status: 'in-progress' },
  { id: '4', content: 'Tarea 4', status: 'completed' },
];

const DragDropBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  
  // Establece el color como 'primary'
  const selectedColor = "primary";

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDrop = (status: 'pending' | 'in-progress' | 'completed') => {
    if (draggedTask) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === draggedTask.id ? { ...task, status } : task
        )
      );
      setDraggedTask(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const filteredTasks = (status: 'pending' | 'in-progress' | 'completed') =>
    tasks.filter((task) => task.status === status);

  const DropdownContent = ({ task }: { task: Task }) => (
    <Dropdown>
      <DropdownTrigger>
        <Button
          color={selectedColor}
          variant="solid"
          className="capitalize"
          draggable
          onDragStart={() => handleDragStart(task)}
        >
          {task.content}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Task Actions" color={selectedColor} variant="solid">
        <DropdownItem key="edit">Edit</DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );

  return (
    <div className="flex gap-8 mt-8">
      <div
        onDrop={() => handleDrop('pending')}
        onDragOver={handleDragOver}
        className="w-64 h-64 border-4 border-dashed border-gray-500 rounded-lg p-2"
      >
        <h4 className="text-center font-semibold">Pendiente</h4>
        {filteredTasks('pending').map((task) => (
          <DropdownContent key={task.id} task={task} />
        ))}
      </div>

      <div
        onDrop={() => handleDrop('in-progress')}
        onDragOver={handleDragOver}
        className="w-64 h-64 border-4 border-dashed border-gray-500 rounded-lg p-2"
      >
        <h4 className="text-center font-semibold">En Progreso</h4>
        {filteredTasks('in-progress').map((task) => (
          <DropdownContent key={task.id} task={task} />
        ))}
      </div>

      <div
        onDrop={() => handleDrop('completed')}
        onDragOver={handleDragOver}
        className="w-64 h-64 border-4 border-dashed border-gray-500 rounded-lg p-2"
      >
        <h4 className="text-center font-semibold">Completado</h4>
        {filteredTasks('completed').map((task) => (
          <DropdownContent key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default DragDropBoard;
