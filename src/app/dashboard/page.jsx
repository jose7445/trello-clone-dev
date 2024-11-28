"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState, useEffect } from "react";
import CreateBoard from "./_components/CreateBoard";
import BoardPage from "./_components/BoardPage";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  padding: "16px",
  border: "none",
};

const DashboardPage = () => {
  const [open, setOpen] = useState(false);
  const [boards, setBoards] = useState([]); // Estado para los boards

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    // Hacer la petición GET para obtener los boards
    const fetchBoards = async () => {
      try {
        const response = await fetch("/api/boards"); // Ajusta la URL de acuerdo a tu ruta
        const data = await response.json();
        if (response.ok) {
          console.log(data);
          setBoards(data); // Guardar los boards en el estado
        } else {
          console.error("Error al obtener los boards", data);
        }
      } catch (error) {
        console.error("Hubo un error al cargar los boards", error);
      } finally {
      }
    };

    fetchBoards(); // Llamada a la API cuando el componente se monta
  }, []);

  return (
    <div>
      <div className="flex items-center justify-center flex-col">
        {boards.length > 0 ? (
          // Si hay boards, mostrar los boards
          boards.map((board) => <BoardPage key={board.id} board={board} />)
        ) : (
          // Si no hay boards, mostrar el mensaje y el botón de crear
          <>
            <div className="text-sm md:text-lg text-neutral-500 max-w-xs md:max-w-2xl text-center mb-4">
              You do not have any boards yet. Time to start organizing!
            </div>

            <Button
              onClick={handleOpen}
              className="bg-primary hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
            >
              CREATE BOARD
            </Button>

            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  className="text-gray-700 font-semibold"
                >
                  CREATE BOARD
                </Typography>
                {/* Pasar la función handleClose como prop a CreateBoard */}
                <CreateBoard closeModal={handleClose} />
              </Box>
            </Modal>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
