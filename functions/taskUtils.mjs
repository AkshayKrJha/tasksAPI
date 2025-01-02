export function createTask(users) {
  return function (req, res) {
    // create a task
    const userName = req.user.userName;
    const { description, dueDate } = req.body;
    console.log("<<<<<<<<<<<Authenticated User info>>>>>>>>>", req.user);
    const userTasks = users.get(userName)?.tasks;
    // set some random id
    let mapSize = userTasks?.size;
    let key = mapSize ? +[...userTasks][mapSize - 1][0] + 1 : 0;
    key = `${key}`;
    userTasks.set(key, { description, dueDate });
    res.json({ message: "Task added", tasks: [...userTasks] });
  };
}

export function readTask(users) {
  return function (req, res) {
    const userName = req.user.userName;
    console.log("Authenticated User info", req.user);
    const userTasks = users.get(userName)?.tasks;
    console.log("Tasks\t", userTasks);
    res.json({ message: "Tasks found", tasks: [...userTasks] });
    // res.json({
    //   message: "Tasks found",
    //   tasks: [
    //     ...new Map([[1, { description: "sadasd", dueDate: "12 jan 2025" }]]),
    //   ],
    // });
  };
}

export function updateTask(users) {
  return function (req, res) {
    const userName = req.user.userName;
    const {
      body,
      params: { id },
    } = req;
    const { description, dueDate } = body;
    const userTasks = users.get(userName)?.tasks;
    userTasks.set(id, { description, dueDate });
    res.json({ message: "Task Updated", tasks: [...userTasks] });
  };
}

export function deleteTask(users) {
  return function (req, res) {
    const userName = req.user.userName;
    const userTasks = users.get(userName)?.tasks;
    const {
      params: { id },
    } = req;
    userTasks.delete(id);
    res.json({ message: "Task deleted", tasks: [...userTasks] });
  };
}

export function filterTasks(users) {
  return function (req, res) {
    const userName = req.user.userName;
    const { status } = req.query;
    const userTasks = users.get(userName)?.tasks;
    let filteredTasks;
    if (status?.toLowerCase() === "overdue") {
      filteredTasks = new Map(
        [...userTasks].filter(([k, v]) => {
          console.log(
            "Dates",
            v?.dueDate,
            "is belw  ",
            +new Date(v?.dueDate) < +new Date(new Date().toDateString())
          );
          return +new Date(v?.dueDate) < +new Date(new Date().toDateString());
        })
      );
    } else if (status.toLowerCase() === "today") {
      filteredTasks = new Map(
        [...userTasks].filter(([k, v]) => {
          return +new Date(v?.dueDate) == +new Date(new Date().toDateString());
        })
      );
    } else filteredTasks = userTasks;
    res.json({ message: "Filtered tasks found", tasks: [...filteredTasks] });
  };
}
