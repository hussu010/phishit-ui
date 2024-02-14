"use client";
import { API_URL } from "@/config/constants";
import { Action, Response } from "@/config/types";
import { RootState } from "@/redux/reducer";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function Page() {
  const { isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.auth
  );
  const { roles } = useSelector((state: RootState) => state.users);
  const [interactions, setInteractions] = useState<Action[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/backoffice/interactions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setInteractions(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log(isAuthenticated, accessToken, roles);
  return (
    <Table>
      <TableCaption>Recent Activities</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">User Id</TableHead>
          <TableHead>User Name</TableHead>
          <TableHead>Recources</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {interactions.map((interaction, index) => {
          return (
            <TableRow key={index}>
              <TableCell className="font-medium">
                {interaction.user._id}
              </TableCell>
              <TableCell>{interaction.user.username}</TableCell>
              <TableCell>{interaction.resource}</TableCell>
              <TableCell className="text-right">{interaction.action}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default Page;
