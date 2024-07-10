### Documentation for the Support and Ticketing System

This documentation provides an overview of the Support and Ticketing system implemented in the backend. It covers the models, serializers, views, URLs, and how to use the API endpoints.

---

### Models

#### Ticket

Represents a support ticket created by a user.

- **Fields:**
  - `user` (ForeignKey): The user who created the ticket.
  - `category` (CharField): The category of the ticket. Choices are 'order', 'general', 'technical'.
  - `status` (CharField): The current status of the ticket. Choices are 'open', 'pending', 'closed'. Default is 'open'.
  - `title` (CharField): The title of the ticket.
  - `description` (TextField): The description of the ticket.
  - `order` (ForeignKey): The order related to the ticket, if applicable.
  - `created_at` (DateTimeField): The date and time the ticket was created.
  - `updated_at` (DateTimeField): The date and time the ticket was last updated.

#### TicketMessage

Represents a message related to a ticket.

- **Fields:**
  - `ticket` (ForeignKey): The ticket the message is related to.
  - `user` (ForeignKey): The user who created the message.
  - `message` (TextField): The content of the message.
  - `created_at` (DateTimeField): The date and time the message was created.

#### Attachment

Represents an attachment related to a ticket message.

- **Fields:**
  - `ticket_message` (ForeignKey): The message the attachment is related to.
  - `file` (FileField): The attached file.
  - `uploaded_at` (DateTimeField): The date and time the attachment was uploaded.

---

### Serializers

#### TicketSerializer

Handles serialization and validation of Ticket objects.

- **Fields:**
  - `id`, `user`, `category`, `status`, `title`, `description`, `order`, `created_at`, `updated_at`, `messages`

#### TicketMessageSerializer

Handles serialization and validation of TicketMessage objects.

- **Fields:**
  - `id`, `user`, `message`, `created_at`, `attachments`

#### AttachmentSerializer

Handles serialization of Attachment objects.

- **Fields:**
  - `id`, `file`, `uploaded_at`

---

### Views

#### TicketListCreateView

Handles the listing and creation of tickets.

- **Methods:**
  - `GET`: List all tickets for the authenticated user.
  - `POST`: Create a new ticket for the authenticated user.

#### TicketDetailView

Handles retrieving, updating, and deleting a specific ticket.

- **Methods:**
  - `GET`: Retrieve a specific ticket.
  - `PATCH`: Update a specific ticket.
  - `DELETE`: Delete a specific ticket.

#### TicketMessageCreateView

Handles the creation of messages related to a ticket.

- **Methods:**
  - `POST`: Create a new message for a specific ticket.

#### TicketStatusUpdateView

Handles updating the status of a ticket.

- **Methods:**
  - `PATCH`: Update the status of a specific ticket.

---

### URLs

The URLs for the Support and Ticketing system are defined in `tickets/urls.py`.

- **Endpoints:**
  - `api/tickets/`: List all tickets or create a new ticket.
  - `api/tickets/<int:pk>/`: Retrieve, update, or delete a specific ticket.
  - `api/tickets/<int:ticket_id>/messages/`: Create a new message for a specific ticket.
  - `api/tickets/<int:pk>/status/`: Update the status of a specific ticket.

---

### API Usage

#### 1. Submitting a Ticket

- **Endpoint:** `POST /api/tickets/`
- **Payload:**
  ```json
  {
    "category": "order",
    "title": "Issue with my order",
    "description": "The order has not been delivered yet.",
    "order_id": 1
  }
  ```

#### 2. Viewing a Ticket's Details

- **Endpoint:** `GET /api/tickets/<int:pk>/`
- **Response:**
  ```json
  {
    "id": 1,
    "user": "username",
    "category": "order",
    "status": "open",
    "title": "Issue with my order",
    "description": "The order has not been delivered yet.",
    "order": {
      "id": 1,
      "transaction_id": "TX123"
    },
    "created_at": "2023-07-09T12:34:56Z",
    "updated_at": "2023-07-09T12:34:56Z",
    "messages": [
      {
        "id": 1,
        "user": "username",
        "message": "Follow-up message",
        "created_at": "2023-07-09T12:45:00Z",
        "attachments": [
          {
            "id": 1,
            "file": "/media/attachments/file.pdf",
            "uploaded_at": "2023-07-09T12:45:00Z"
          }
        ]
      }
    ]
  }
  ```

#### 3. Submitting a Message with Attachments

- **Endpoint:** `POST /api/tickets/<int:ticket_id>/messages/`
- **Payload:**
  ```json
  {
    "message": "This is a message with attachments."
  }
  ```
- **Files:** Attach files via form-data in Postman or your preferred tool.

#### 4. Admin Updating Ticket Status to Closed

- **Endpoint:** `PATCH /api/tickets/<int:pk>/status/`
- **Payload:**
  ```json
  {
    "status": "closed"
  }
  ```

### Permissions

- **Users:** Can view their own tickets, add messages to their own tickets, and create new tickets.
- **Admins:** Can view, update, and delete all tickets. Can also change the status of tickets.

---

This completes the documentation for the support and ticketing system in your Django backend. If you have any further questions or need additional features, feel free to ask!