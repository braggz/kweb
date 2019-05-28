 Table structure for table `file`

 
CREATE TABLE `file` (
  
  `username` varchar(255) NOT NULL,
  `path` text NOT NULL,
   `name` text NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
