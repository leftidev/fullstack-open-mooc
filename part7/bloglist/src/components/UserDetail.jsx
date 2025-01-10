import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import userService from '../services/users';

const UserDetail = () => {
  const { id } = useParams();
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getById(id),
    retry: 1,
  });

  if (isLoading) return <div>Loading user details...</div>;
  if (isError) return <div>Failed to load user details. Please try again.</div>;

  return (
    <div>
      <h2>{user.name}'s Blogs</h2>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>
            <p>{blog.title}</p>
            <p>{blog.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDetail;
