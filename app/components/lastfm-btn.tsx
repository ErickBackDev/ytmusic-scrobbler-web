import getServerSession from "@/helpers/get-server-session";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Component() {
  const session = await getServerSession();

  const { LAST_FM_API_KEY } = process.env;

  const userEmail = session?.user?.email;

  if (!LAST_FM_API_KEY || !userEmail) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  if (!user) {
    return null;
  }

  if (user.lastFmSessionKey) {
    return (
      <p>
        You have already authorized Last.fm.{" "}
        {user.lastFmUsername && (
          <a
            href={`https://www.last.fm/user/${user.lastFmUsername}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View profile
          </a>
        )}
      </p>
    );
  }

  return (
    <a
      href={`https://www.last.fm/api/auth/?api_key=${LAST_FM_API_KEY}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      Authorize Last.fm
    </a>
  );
}