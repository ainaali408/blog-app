export const canCreatePost = (role) => {
  return role === "Author" || role === "Admin";
};

export const canEditPost = (role, userId, authorId) => {
  return role === "Admin" || (role === "Author" && userId === authorId);
};

export const canDeletePost = (role, userId, authorId) => {
  return role === "Admin" || (role === "Author" && userId === authorId);
};

export const canComment = (role) => {
  return role === "viewer" || role === "Author" || role === "Admin";
};