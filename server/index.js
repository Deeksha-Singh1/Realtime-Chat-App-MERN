const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// used to load env variable from a '.env' file
require("dotenv").config();