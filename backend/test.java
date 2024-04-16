class Main {
 static void main(String[] args) {
  User user = null; // user is intentionally set to null

  try {
   String lastName = user.getLastName(); // Null dereference here
   System.out.println("Last Name: " + lastName);
  } catch (NullPointerException e) {
   System.out.println("Error: User object is null");
  }
 }
}
