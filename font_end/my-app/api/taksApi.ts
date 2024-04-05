export const getTasks = async (id: number, token: string) =>
  await fetch(`http://localhost:4000/api/v01/tasks/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

export const postTask = async (data: any, token: string) =>
  await fetch(`http://localhost:4000/api/v01/postTasks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

export const postRegister = async (data: any) =>
  await fetch(`http://localhost:4000/api/v01/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

export const postLog = async (data: any) =>
  await fetch(`http://localhost:4000/api/v01/log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const putTask = async (data: any, token: string) =>
  await fetch(`http://localhost:4000/api/v01/putTasks`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
