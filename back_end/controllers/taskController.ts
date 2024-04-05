import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllTasks = async (req: Request, res: Response) => {
  const allTask = await prisma.taskList.findMany({
    include: {
      tasks: true,
    },
  });
  if (allTask) {
    res.json(allTask);
  } else {
    res.status(500).json({ error: "erreur lors de la recuperation" });
  }
};

export const getSingleTasks = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const allTask = await prisma.taskList.findMany({
    where: {
      userId: userId,
    },
    include: {
      tasks: true,
    },
  });
  if (allTask) {
    res.json(allTask);
  } else {
    res.status(500).json({ error: "erreur lors de la recuperation" });
  }
};

export const createTaskList = async (req: Request, res: Response) => {
  const { datecreate, description, title, userId, tasks } = req.body;
  const generateRandomColor = () => {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    return randomColor;
  };
  try {
    const newTaskList = await prisma.taskList.create({
      data: {
        datecreate,
        description,
        title,
        codecoleur: generateRandomColor(),
        //Cette partie du code est utilisée pour établir une relation entre la nouvelle TaskList et un utilisateur existant dans la base de données à l'aide de Prisma. Voici ce que font les différentes parties de ce code :
        // user: : C'est la relation entre la TaskList et l'utilisateur. Dans le modèle Prisma, cette relation est définie comme suit : user: User @relation(fields: [userId], references: [id])

        //     Cela signifie que chaque TaskList est associée à un utilisateur à travers le champ userId.
        //     connect: : C'est une action qui indique à Prisma de créer une relation avec un enregistrement existant plutôt que de créer un nouvel enregistrement.
        //     id: userId :
        //         id : C'est le champ dans la table User vers lequel la TaskList doit être connectée.
        //         userId : C'est la valeur de l'ID de l'utilisateur que vous avez extrait de req.body.

        // En résumé, cette partie du code indique à Prisma de créer une nouvelle TaskList et de la connecter à un utilisateur existant en utilisant l'ID de cet utilisateur.
        user: {
          connect: {
            id: userId,
          },
        },

        //     Cette partie du code est utilisée pour créer plusieurs nouvelles tâches (Task) associées à la nouvelle TaskList que vous êtes en train de créer. Voici ce que font les différentes parties de ce code :

        // tasks: : C'est la relation entre la TaskList et les tâches. Dans le modèle Prisma, cette relation est définie comme suit :tasks: Task[]

        //     Cela signifie qu'une TaskList peut avoir plusieurs tâches associées.
        //     createMany: : C'est une action qui indique à Prisma de créer plusieurs nouvelles entrées dans la table Task.
        //     data: tasks :
        //         data : C'est le tableau de données des nouvelles tâches que vous souhaitez créer.
        //         tasks : C'est le tableau de tâches que vous avez extrait de req.body.

        // En résumé, cette partie du code indique à Prisma de créer plusieurs nouvelles tâches et de les associer à la TaskList que vous êtes en train de créer.
        tasks: {
          createMany: {
            data: tasks,
          },
        },
      },

      //       Cette partie du code est utilisée pour inclure les tâches associées à la nouvelle TaskList dans la réponse JSON renvoyée après la création de la TaskList. Voici ce que fait cette partie du code :

      //     include: : Cette option est utilisée pour inclure des relations dans la réponse. Elle permet d'inclure des données liées à l'objet principal que vous récupérez ou créez.

      //     tasks: true :
      //         tasks : C'est la relation que vous souhaitez inclure dans la réponse. Dans ce cas, vous voulez inclure les tâches associées à la TaskList.
      //         true : Cela indique à Prisma d'inclure les tâches associées à la TaskList dans la réponse.

      // En résumé, cette partie du code permet d'inclure les tâches associées à la nouvelle TaskList dans la réponse JSON renvoyée après la création de la TaskList, ce qui permet d'avoir toutes les informations nécessaires sur la TaskList et ses tâches associées dans la réponse.
      include: {
        tasks: true,
      },
    });

    res.json({ message: "success" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la création de la liste de tâches" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const { taskId, task, completed, cancel } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        task,
        completed,
        cancel,
      },
    });

    const updatedTaskList = await prisma.taskList.findUnique({
      where: {
        id: updatedTask.taskListId,
      },
      include: {
        tasks: true,
      },
    });

    res.json(updatedTaskList);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la tâche" });
  }
};
