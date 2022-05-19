const express = require("express");
const app = express();

const pool = require("../../utils/pool-connection");

const { errorWrap } = require("../../middleware");

const GET_ALL_COMMENTS = `
    SELECT * FROM Comment
`;

const GET_COMMENTS_FOR_APT_ID = `
    SELECT * FROM Comment WHERE ApartmentId = ?
`;
// Query 1
const GET_COMMENTS_FROM_RESIDENTS = `
    SELECT CommentId, OverallScore, NoiseScore, LocationScore, WifiScore, FeedbackText
FROM Comment c JOIN Resident r ON r.ResidentId = c.ResidentId 
WHERE r.ApartmentId IN (SELECT a.ApartmentId 
                        FROM Apartment a 
WHERE a.ApartmentId = ?) AND c.ApartmentId IN (SELECT b.ApartmentId 
                        FROM Apartment b 
WHERE b.ApartmentId = ?);
`;

/**
 * Update comment text
 */
const UPDATE_COMMENT = `
    UPDATE Comment SET FeedbackText = ? WHERE CommentId = ?
`;

// TODO: Should I put the address here?

app.get("/", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      if (connection) {
        connection.release();
      }

      return res.send(err);
    }

    connection.query(GET_ALL_COMMENTS, (err, results) => {
      connection.release();

      if (err) {
        return res.send(err);
      }

      return res.json(results);
    });
  });
});

// Get a comment by an id
app.get(
  "/:id",
  errorWrap((req, res) => {
    const { id } = req.params;

    const query = `
        SELECT * FROM Comment WHERE CommentId = ?
    `;

    pool.getConnection((err, connection) => {
      if (err) {
        if (connection) {
          connection.release();
        }

        return res.send(err);
      }

      connection.query(query, [id], (err, results) => {
        connection.release();

        if (err) {
          return res.send(err);
        }

        return res.json(results);
      });
    });
  })
);

app.get("/apartment/:aptid", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      if (connection) {
        connection.release();
      }

      return res.send(err);
    }

    connection.query(
      GET_COMMENTS_FOR_APT_ID,
      [req.params.aptid],
      (err, results) => {
        connection.release();

        if (err) {
          return res.send(err);
        }

        return res.json(results);
      }
    );
  });
});

app.get("/resident/:aptId", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      if (connection) {
        connection.release();
      }

      return res.send(err);
    }

    connection.query(
      GET_COMMENTS_FROM_RESIDENTS,
      [req.params.aptId, req.params.aptId],
      (err, results) => {
        connection.release();

        if (err) {
          return res.send(err);
        }

        return res.json(results);
      }
    );
  });
});

// Adds a comment and updates the averages in the review table
app.post(
  "/",
  errorWrap((req, res) => {
    const {
      apartmentId,
      residentId,
      feedback,
      overallScore,
      noiseScore,
      locationScore,
      wifiScore,
    } = req.body;

    console.log(req.body);

    const addCommentQuery = `
        INSERT INTO Comment(ResidentId, ApartmentId, FeedbackText,
        OverallScore, NoiseScore, LocationScore, WifiScore)
        VALUES(?, ?, ?, ?, ?, ?, ?)
    `;

    pool.getConnection((err, connection) => {
      if (err) {
        if (connection) {
          // connection.release();
        }

        return res.send(err);
      }

      connection.query(
        addCommentQuery,
        [
          residentId,
          apartmentId,
          feedback,
          overallScore,
          noiseScore,
          locationScore,
          wifiScore,
        ],
        (err, results) => {
          if (err) {
            return res.send(err);
          }

          // Updates review table by getting the review for the apartment and updating the averages

          // Get current averages for an apartment
          const getReviewQuery = `
                SELECT * FROM Review WHERE ApartmentId = ?
            `;

          connection.query(
            getReviewQuery,
            [apartmentId],
            (err, reviewResults) => {
              if (err) {
                return res.send(err);
              }

              // Get the current averages

              // Account for if there are no comments
              if (reviewResults.length === 0) {
                const updateReviewQuery = ` 
                        INSERT INTO Review(ApartmentId, OverallAvgScore, NoiseAvgScore, LocationAvgScore, WifiAvgScore)
                        VALUES(?, ?, ?, ?, ?)
                    `;

                connection.query(
                  updateReviewQuery,
                  [
                    apartmentId,
                    overallScore,
                    noiseScore,
                    locationScore,
                    wifiScore,
                  ],
                  (err, results) => {
                    if (err) {
                      return res.send(err);
                    }

                    // return res.json(results);
                  }
                );
              }

              const {
                OverallAvgScore,
                NoiseAvgScore,
                LocationAvgScore,
                WifiAvgScore,
              } = reviewResults[0];

              // Count the number of comments for an apartment
              const getCommentCountQuery = `
              SELECT COUNT(*) AS CommentCount FROM Comment WHERE ApartmentId = ?
              `;

              connection.query(
                getCommentCountQuery,
                [apartmentId],
                (err, commentCountResults) => {
                  if (err) {
                    // connection.release();
                    return res.send(err);
                  }

                  // Get the number of comments

                  const { CommentCount } = commentCountResults[0];

                  // Account for if there are no comments // QUESTION: is there ever a case this would happen if we just added a comment?
                  if (CommentCount === 1) {
                    const updateReviewQuery = `
                    UPDATE Review SET OverallAvgScore = ?, NoiseAvgScore = ?, LocationAvgScore = ?, WifiAvgScore = ?
                    WHERE ApartmentId = ?
                    `;

                    connection.query(
                      updateReviewQuery,
                      [
                        OverallAvgScore,
                        NoiseAvgScore,
                        LocationAvgScore,
                        WifiAvgScore,
                        apartmentId,
                      ],
                      (err, results) => {
                        if (err) {
                          return res.send(err);
                        }

                        // return res.json(results);
                      }
                    );
                  }

                  // Calculate the new averages

                  // Calculate the new overall average
                  // QUESTION shouldn't this be CommentCount - 1 / CommentCount (we need to check if there's only 1 comment)
                  const newOverallAvgScore =
                    (OverallAvgScore * (CommentCount - 1) + overallScore) /
                    CommentCount; // QUESTION: do we need plus one here given that the comment count was already updated?
                  const newNoiseAvgScore =
                    (NoiseAvgScore * (CommentCount - 1) + noiseScore) /
                    CommentCount;
                  const newLocationAvgScore =
                    (LocationAvgScore * (CommentCount - 1) + locationScore) /
                    CommentCount;
                  const newWifiAvgScore =
                    (WifiAvgScore * (CommentCount - 1) + wifiScore) /
                    CommentCount;

                  // Update the review table with the new averages
                  const updateReviewQuery = `
                UPDATE Review SET OverallAvgScore = ?, NoiseAvgScore = ?, LocationAvgScore = ?, WifiAvgScore = ?
                        WHERE ApartmentId = ?
                    `;

                  connection.query(
                    updateReviewQuery,
                    [
                      newOverallAvgScore,
                      newNoiseAvgScore,
                      newLocationAvgScore,
                      newWifiAvgScore,
                      apartmentId,
                    ],
                    (err, updateReviewResults) => {
                      // connection.release();
                      if (err) {
                        return res.send(err);
                      }

                      return res.json(updateReviewResults);
                    }
                  );
                }
              );
            }
          );
        }
      );

      connection.release();
    });
  })
);

app.delete(
  "/:id",
  errorWrap((req, res) => {
    const { id } = req.params;

    const GET_COMMENT_SCORES = `
            SELECT ApartmentId, OverallScore, NoiseScore, LocationScore, WifiScore FROM Comment WHERE CommentId = ?
        `;

    pool.getConnection((err, connection) => {
      if (err) {
        if (connection) {
          connection.release();
        }

        return res.send(err);
      }

      connection.query(GET_COMMENT_SCORES, [id], (err, commentResults) => {
        if (err) {
          return res.send(err);
        }

        if (commentResults.length === 0) {
          return res.json(commentResults); // TODO: 404
        }

        const {
          ApartmentId,
          OverallScore,
          NoiseScore,
          LocationScore,
          WifiScore,
        } = commentResults[0];

        const DELETE_COMMENT = `
            DELETE FROM Comment WHERE CommentId = ?
            `;

        connection.query(DELETE_COMMENT, [id], (err, deleteResults) => {
          if (err) {
            return res.send(err);
          }

          return res.json(deleteResults);
        });
      });

      connection.release();
    });
  })
);

// Updates a comment
app.put("/:commentId", (req, res) => {
  const { commentId } = req.params;
  const { feedbackText } = req.body;
  console.log(feedbackText);
  console.log(commentId);

  pool.getConnection((err, connection) => {
    if (err) {
      if (connection) {
        connection.release();
      }

      return res.send(err);
    }

    connection.query(
      UPDATE_COMMENT,
      [feedbackText, commentId],
      (err, results) => {
        connection.release();

        if (err) {
          return res.send(err);
        }

        return res.json({ data: results });
      }
    );
  });
});


app.get('/top/procedure', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      if (connection) {
        connection.release();
      }
      
      return res.send(err);
    }
  
    const QUERY = 'CALL ManagementBooster()';

    connection.query(QUERY, (err, results) => {

      console.log(results);
      connection.release();

      if (err) {
        return res.send(err);
      }

      return res.json({ data: results });

    });

  });
});


module.exports = app;