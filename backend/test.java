class Hello {
  int test() {
    String s = null;
    if (s != null) {  // Check if s is not null
      return s.length();
    } else {
      // Handle the case where s is null
      return 0; // Or throw an exception
    }
  }
}