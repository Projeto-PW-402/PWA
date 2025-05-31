document.addEventListener('DOMContentLoaded', function() {
  const profileIcon = document.getElementById('profile-icon');
  const sidebar = document.getElementById('sidebar');
  const closeSidebar = document.getElementById('close-sidebar');

  if (profileIcon && sidebar && closeSidebar) {
   
    profileIcon.addEventListener('click', function(event) {
      sidebar.classList.toggle('active');
      event.stopPropagation(); 
    });

    
    closeSidebar.addEventListener('click', function(event) {
      sidebar.classList.remove('active');
      event.stopPropagation(); 
    });

    document.addEventListener('click', function(event) {
      if (sidebar.classList.contains('active') &&
          !sidebar.contains(event.target) &&
          !profileIcon.contains(event.target)) {
        sidebar.classList.remove('active');
      }
    });
  }
});