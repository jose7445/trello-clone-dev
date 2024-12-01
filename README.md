# Trello Clone

Trello Clone is a web application built with Next.js that emulates the basic functionalities of Trello, allowing users to create, edit, and manage boards, lists, and cards. It uses various modern technologies to provide a smooth and scalable experience.

## Características

- User authentication with **NextAuth**.
- Data management with **Mongoose** and **Axios**.
- Modern UI with **Chakra UI** and **Tailwind CSS**.
- Validated forms with **Formik** and **Yup**.
- Real-time notification support with **React Hot Toast**.

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/jose7445/trello-clone-dev.git
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Getting started:

   ```bash
   npm run dev
   ```

## Dependencies

- **@chakra-ui/react**: UI Component Library for React.
- **@emotion/react**: Chakra UI dependency for styling.
- **axios**: HTTP client for making requests.
- **bcryptjs**: Password encryption.
- **formik**: Library for handling forms in React.
- **mongoose**: MongoDB ODM for interacting with the database.
- **next**: React framework for building web applications.
- **next-auth**: Authentication for Next.js.
- **next-themes**: Dynamic theme management.
- **react**: Main React library.
- **react-dom**: React DOM for DOM manipulation.
- **react-hot-toast**: Library for real-time notifications.
- **react-icons**: Library for React icons.
- **yup**: Schema validation for forms.

## Road map

The following tasks could not be completed due to lack of time. However, they are included in a road map to be developed later.

- **Implement role-based access control**: Admins can manage all tasks, while regular users can only manage their own tasks (You can use libraries like NextAuth).
- **Sort and filter tasks**: A page that displays tables that show the list of tasks something like Trello. The user should be able to modify and delete.
- **Create data table**: The table should have some functionality such as sorting and filters.
- **Unit tests**: Write tests fo backend and frontend.
- **Drag and Drop**: Use drag and drop to move the tasks.

## Hosting

You can access the project through the following URL:

[www.google.es](http://www.google.es)
