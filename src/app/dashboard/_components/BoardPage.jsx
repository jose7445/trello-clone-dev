import React from "react";

// El componente BoardPage ahora recibe "data" como prop
function BoardPage({ board }) {
  return (
    <div>
      <h1 className="text-3xl md:text-6xl text-center text-neutral-800 font-bold">
        Board {board.title}
      </h1>

      {/* BOARD */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow w-fit">
        {/* To Do Column */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-neutral-800">To Do</h3>
          <div className="mt-4">
            {/* Aquí puedes agregar tareas de la lista "To Do" */}
            <div className="bg-white p-3 mb-2 rounded shadow">Tarea 1</div>
            <div className="bg-white p-3 mb-2 rounded shadow">Tarea 2</div>
          </div>
        </div>

        {/* In Progress Column */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-neutral-800">
            In Progress
          </h3>
          <div className="mt-4">
            {/* Aquí puedes agregar tareas de la lista "In Progress" */}
            <div className="bg-white p-3 mb-2 rounded shadow">
              Tarea en progreso 1
            </div>
          </div>
        </div>

        {/* Done Column */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-neutral-800">Done</h3>
          <div className="mt-4">
            {/* Aquí puedes agregar tareas de la lista "Done" */}
            <div className="bg-white p-3 mb-2 rounded shadow">
              Tarea completada 1
            </div>
            <div className="bg-white p-3 mb-2 rounded shadow">
              Tarea completada 2
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoardPage;
