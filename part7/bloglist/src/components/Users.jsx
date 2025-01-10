import { useQuery } from '@tanstack/react-query';
import userService from '../services/users';
import { Link } from 'react-router-dom';

const Users = () => {
  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    retry: 1,
  });

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Failed to load users. Please try again.</div>;

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>
              {user.name} ({user.username}) 
              </Link>
              - Blogs created: {user.blogs.length}

          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
