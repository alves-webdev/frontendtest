import "./App.css";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import myoctokit from "./UseApi/useApi";
import { useEffect, useState } from "react";
import { User, Repository } from "./_types";
import Pagination from "./components/pagination/pagination";
import CloseIcon from "@mui/icons-material/Close";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [Repositories, setRepositories] = useState<Repository[]>([]);
  const [page, setPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(12);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const lasPostIntex = page * postPerPage;
  const firstPostIntex = lasPostIntex - postPerPage;
  const currentPost = users.slice(firstPostIntex, lasPostIntex);


  const getUsers = async () => {
    const response = await myoctokit.request("GET /users{?since,per_page}", {
      since: 0,
      per_page: 100,
    });
    setUsers(response.data);
  };

  const hadleCardClick = async (login: string) => {
    const userresponse: any = await myoctokit.request("GET /users/{username}", {
      username: login,
    });
    setSelectedUser(userresponse.data);
    const response: any = await myoctokit.request(
      "GET /users/{username}/repos",
      {
        username: login,
      }
    );
    setRepositories(response.data);
    console.log(response.data);
  };

  useEffect(() => {
    getUsers();
  }, [page]);

  console.log(users[users.length - 1]?.id);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isOpen && (
        <div className="profile">
          <CloseIcon className="closeicon" onClick={() => setIsOpen(false)} />
          <div className="info">
            <img src={selectedUser?.avatar_url} alt="avatar" />
            <h3>User: {selectedUser?.login}</h3>
            <h3>user id: {selectedUser?.id}</h3>
            <h3>Name: {selectedUser?.name}</h3>
            <h4>Created at: {selectedUser?.created_at}</h4>
            <h4>{selectedUser?.location}</h4>
            <h4>
              <a href={selectedUser?.html_url}>{selectedUser?.html_url}</a>
            </h4>
          </div>
          <div className="repo">
            <h1>{selectedUser?.login}'s Repositories</h1>
            {Repositories.map((repo) => (
              <Accordion key={repo.id} className="accordion">
                <AccordionSummary>
                  <h1>{repo.name}</h1>
                </AccordionSummary>
                <AccordionDetails className="repo-details">
                  <h3>Repository id: {repo.id}</h3>
                  <h3>
                    <a href={repo.html_url}>{repo.html_url}</a>
                  </h3>
                  <h4>{repo.description}</h4>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Pagination
          postsPerPage={postPerPage}
          totalPosts={users.length}
          paginate={setPage}
        />
      </div>
      <div className="App">
        {currentPost.map((user) => (
          <div className="card" key={user.id}>
            <Box
              className="Box"
              onClick={() => {
                hadleCardClick(user.login);
                setIsOpen(true);
                console.log(selectedUser);
              }}
            >
              <img src={user.avatar_url} alt={user.login} width="100" />
              <span>{user.login}</span>
              <span>{user.id}</span>
            </Box>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
